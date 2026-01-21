import {
  DeleteObjectCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { URL } from 'node:url';

@Injectable()
export class StorageService {
  protected readonly client: S3Client;
  private readonly bucket: string;

  public constructor(private readonly configService: ConfigService) {
    const endpoint = this.getS3Endpoint();
    const forcePathStyle = this.getS3ForcePathStyle(endpoint);

    this.client = new S3Client({
      endpoint,
      forcePathStyle,
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
  }

  private getS3Endpoint(): string {
    const rawEndpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');
    const portRaw = this.configService.get<string>('S3_PORT');

    const url = new URL(
      /^https?:\/\//i.test(rawEndpoint)
        ? rawEndpoint
        : `https://${rawEndpoint}`,
    );

    const port = portRaw ? Number(portRaw) : undefined;

    if (
      port &&
      Number.isFinite(port) &&
      port > 0 &&
      port < 65536 &&
      !url.port
    ) {
      if (url.protocol === 'https:' && port === 433) {
        url.port = '443';
      } else if (
        !(url.protocol === 'https:' && port === 443) &&
        !(url.protocol === 'http:' && port === 80)
      ) {
        url.port = String(port);
      }
    }

    return url.toString();
  }

  private getS3ForcePathStyle(endpoint: string): boolean {
    const explicit = this.configService.get<string>('S3_FORCE_PATH_STYLE');

    if (explicit === 'true') {
      return true;
    }

    if (explicit === 'false') {
      return false;
    }

    const hostname = new URL(endpoint).hostname;

    return !hostname.endsWith('amazonaws.com');
  }

  public async upload(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      await this.client.send(new PutObjectCommand(command));
    } catch (error) {
      const details =
        error instanceof Error ? `${error.name}: ${error.message}` : undefined;

      throw new InternalServerErrorException(
        details
          ? `Ошибка при загрузке файла в хранилище. ${details}`
          : 'Ошибка при загрузке файла в хранилище',
        {
          cause: error,
        },
      );
    }
  }

  public async remove(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: String(key),
    });

    try {
      await this.client.send(command);
    } catch (error) {
      const details =
        error instanceof Error ? `${error.name}: ${error.message}` : undefined;

      throw new InternalServerErrorException(
        details
          ? `Ошибка при удалении файла из хранилища. ${details}`
          : 'Ошибка при удалении файла из хранилища',
        {
          cause: error,
        },
      );
    }
  }
}
