import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import {
  StripeOptionsSymbol,
  type TypeStripeOptions,
} from './types/stripe.types';

@Injectable()
export class StripeService extends Stripe {
  public constructor(
    @Inject(StripeOptionsSymbol) private readonly options: TypeStripeOptions,
  ) {
    // TODO: Check for options.stripe
    super(options.apiKey, options.stripe);
  }
}
