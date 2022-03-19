import url from 'url';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GitAccount, GitProvider, PrismaClient, User } from '@prisma/client';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';
import {
  DataType,
  RedisRepositoryService,
} from '../common/redis-repository.service';
import {
  GitlabOAuthTokenResponse,
  GitlabUserInfoResponse,
  GIT_OAUTH_ERROR,
} from './git.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GitService {
  private readonly gitlabApiDomain = 'https://gitlab.com';

  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly redisService: RedisRepositoryService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  private get gitlabOAuthEndpoint(): string {
    return `${this.gitlabApiDomain}/oauth/authorize`;
  }

  private get gitlabOAuthTokenEndpoint(): string {
    return `${this.gitlabApiDomain}/oauth/token`;
  }

  private get gitlabApiEndpoint(): string {
    return `${this.gitlabApiDomain}/api/v4`;
  }

  private get gitlabCallbackEndpoint(): string {
    return `${this.configService.get('SERVER_DOMAIN')}/git/gitlab/callback`;
  }

  async generateGitlabRedirectURI(
    user: User,
    returnURL: string,
  ): Promise<string> {
    const state = nanoid(36);

    const oauthRedirectURI = new url.URL(this.gitlabOAuthEndpoint);
    oauthRedirectURI.searchParams.set(
      'client_id',
      this.configService.get('GITLAB_CLIENT_ID'),
    );
    oauthRedirectURI.searchParams.set(
      'redirect_uri',
      this.gitlabCallbackEndpoint,
    );
    oauthRedirectURI.searchParams.set('response_type', 'code');
    oauthRedirectURI.searchParams.set('state', state);
    oauthRedirectURI.searchParams.set('scope', 'api');

    await this.redisService.putAll(DataType.GITLAB_STATE, state, {
      userID: user.id.toString(),
      returnURL,
    });

    return oauthRedirectURI.href;
  }

  async handleOAuthCallback(
    state: string,
    code?: string,
    error?: string,
    errorDescription?: string,
  ): Promise<string> {
    const stateObj = (await this.redisService.getHash(
      DataType.GITLAB_STATE,
      state,
    )) as { userID: string; returnURL: string };

    if (isEmpty(stateObj)) {
      throw new BadRequestException('Invalid state');
    }

    await this.redisService.remove(DataType.GITLAB_STATE, state);

    const returnURL = new url.URL(stateObj.returnURL);
    returnURL.searchParams.set('success', '1');
    returnURL.searchParams.set('type', GitProvider.GITLAB);

    if (error) {
      returnURL.searchParams.set('success', '0');
      returnURL.searchParams.set('error', GIT_OAUTH_ERROR.INCOMPLETE);
      returnURL.searchParams.set(
        'error_description',
        errorDescription || 'something went wrong',
      );
    }

    if (code) {
      try {
        const oauthToken = await this.exchangeAuthToken(
          code,
          this.gitlabCallbackEndpoint,
        );

        const gitUserInfo = await this.getGitlabUserInfo(
          oauthToken.access_token,
        );

        await this.upsertGitAccount({
          userID: parseInt(stateObj.userID),
          accountID: gitUserInfo.id.toString(),
          accessToken: oauthToken.access_token,
          refreshToken: oauthToken.refresh_token,
          provider: GitProvider.GITLAB,
        });
      } catch (e) {
        this.logger.error(e);
        returnURL.searchParams.set('success', '0');
        returnURL.searchParams.set('error', GIT_OAUTH_ERROR.FAILED);
        returnURL.searchParams.set(
          'error_description',
          'Failed to setup git account',
        );
      }
    }

    return returnURL.href;
  }

  private async exchangeAuthToken(
    code: string,
    redirectURI: string,
  ): Promise<GitlabOAuthTokenResponse> {
    const authTokenQueryParams = new url.URLSearchParams();

    authTokenQueryParams.append(
      'client_id',
      this.configService.get('GITLAB_CLIENT_ID'),
    );
    authTokenQueryParams.append(
      'client_secret',
      this.configService.get('GITLAB_CLIENT_SECRET'),
    );
    authTokenQueryParams.append('code', code);
    authTokenQueryParams.append('grant_type', 'authorization_code');
    authTokenQueryParams.append('redirect_uri', redirectURI);

    const result = await firstValueFrom(
      this.httpService.post<GitlabOAuthTokenResponse>(
        this.gitlabOAuthTokenEndpoint,
        authTokenQueryParams.toString(),
      ),
    );

    return result.data;
  }

  private async getGitlabUserInfo(
    token: string,
  ): Promise<GitlabUserInfoResponse> {
    const result = await firstValueFrom(
      this.httpService.get<GitlabUserInfoResponse>(
        `${this.gitlabApiEndpoint}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    return result.data;
  }

  private async upsertGitAccount(
    gitAccountInfo: Omit<GitAccount, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<GitAccount> {
    return await this.prismaClient.gitAccount.upsert({
      create: {
        ...gitAccountInfo,
      },
      update: {
        ...gitAccountInfo,
      },
      where: {
        userID_accountID_provider: {
          userID: gitAccountInfo.userID,
          accountID: gitAccountInfo.accountID,
          provider: gitAccountInfo.provider,
        },
      },
    });
  }
}
