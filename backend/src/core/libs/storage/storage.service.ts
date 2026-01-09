import {
  DeleteObjectCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  protected readonly client: S3Client;
  private readonly bucket: string;

  public constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
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

  public async upload(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      await this.client.send(new PutObjectCommand(command));
    } catch {
      throw new InternalServerErrorException(
        'Ошибка при загрузке файла в хранилище',
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
    } catch {
      throw new InternalServerErrorException(
        'Ошибка при удалении файла из хранилища',
      );
    }
  }
}
