import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { GitService } from './git.service';
import { Response } from 'express';

@Controller('git')
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @UseGuards(AuthGuard('basic'))
  @Get('/gitlab/get-redirect-uri')
  async getRedirectURI(
    @CurrentUser() user: User,
    @Query('returnURL') returnURL: string,
  ): Promise<string> {
    return await this.gitService.generateGitlabRedirectURI(user, returnURL);
  }

  @Get('/gitlab/callback')
  async oauthCallback(
    @Query('state') state: string,
    @Query('code') code: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Res() res: Response,
  ) {
    const redirectURL = await this.gitService.handleOAuthCallback(
      state,
      code,
      error,
      errorDescription,
    );

    return res.redirect(302, redirectURL);
  }
}
