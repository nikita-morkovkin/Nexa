import { ConfigService } from '@nestjs/config';
import { type TypeStripeOptions } from 'src/modules/libs/stripe/types/stripe.types';

export function getStripeConfig(
  configService: ConfigService,
): TypeStripeOptions {
  return {
    apiKey: configService.getOrThrow<string>('STRIPE_API_KEY'),
    stripe: {
      apiVersion: '2025-12-15.clover',
    },
  };
}
