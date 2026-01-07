import type { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export function getMailerConfig(config: ConfigService): MailerOptions {
  return {
    transport: {
      host: config.getOrThrow<string>('MAILER_HOST'),
      port: config.getOrThrow<number>('MAILER_PORT'),
      secure: false,
      auth: {
        user: config.getOrThrow<string>('MAILER_USER'),
        pass: config.getOrThrow<string>('MAILER_PASSWORD'),
      },
    },
    defaults: {
      from: `"Morkovkin Stream" <${config.getOrThrow<string>('MAILER_FROM')}>`,
    },
  };
}
