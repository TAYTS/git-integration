import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export enum DataType {
  GITLAB_STATE = 'GITLAB_STATE',
}

@Injectable()
export class RedisRepositoryService {
  private readonly client: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.client = this.redisService.getClient();
  }

  async add(
    type: DataType,
    key: string,
    value: string,
    expireDuration: number = this.getExpireDuration(type),
  ): Promise<boolean> {
    try {
      (await this.client.hsetnx(this.getPrimaryKey(type, key), key, value)) &&
        (await this.client.expire(
          this.getPrimaryKey(type, key),
          expireDuration,
        ));
      return true;
    } catch {
      return false;
    }
  }

  async getHash(type: DataType, key: string): Promise<Record<string, string>> {
    return this.client.hgetall(this.getPrimaryKey(type, key));
  }

  async putAll(
    type: DataType,
    key: string,
    fields: Record<string, string>,
    expireDuration: number = this.getExpireDuration(type),
  ): Promise<boolean> {
    try {
      await this.client.hset(this.getPrimaryKey(type, key), fields);
      await this.client.expire(this.getPrimaryKey(type, key), expireDuration);
      return true;
    } catch {
      return false;
    }
  }

  async remove(type: DataType, key: string): Promise<boolean> {
    try {
      return Boolean(await this.client.del(this.getPrimaryKey(type, key)));
    } catch {
      return false;
    }
  }

  private getPrimaryKey(type: DataType, key: string): string {
    return `${type}.${key}`;
  }

  private getExpireDuration(type: DataType): number {
    switch (type) {
      case DataType.GITLAB_STATE: {
        return parseInt(this.configService.get('OAUTH_STATE_EXPIRY_SECOND'));
      }

      default: {
        throw new BadRequestException('Invalid data type');
      }
    }
  }
}
