import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentProvider } from '@sencourrier/types';
import { IsEnum, IsString } from 'class-validator';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';
import { CurrentUser, Public, type AuthenticatedUser } from '../../common/decorators/auth.decorators';
import { SubscriptionsService } from './subscriptions.service';

class CheckoutDto {
  @IsString()
  planId!: string;

  @IsEnum(PaymentProvider)
  provider!: PaymentProvider;
}

@ApiTags('Abonnements')
@Controller('subscriptions')
export class SubscriptionsController {
  private readonly stripe: Stripe | null;

  constructor(
    private readonly subscriptions: SubscriptionsService,
    private readonly config: ConfigService,
  ) {
    const secret = config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secret ? new Stripe(secret) : null;
  }

  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'Formules d’abonnement disponibles' })
  plans() {
    return this.subscriptions.listPlans();
  }

  @ApiBearerAuth()
  @Post('checkout')
  @ApiOperation({ summary: 'Ouvrir un paiement (Stripe, Wave, Orange Money, Free Money)' })
  checkout(@Body() dto: CheckoutDto, @CurrentUser() user: AuthenticatedUser) {
    return this.subscriptions.startCheckout(user.id, dto.planId, dto.provider);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Abonnement en cours' })
  current(@CurrentUser() user: AuthenticatedUser) {
    return this.subscriptions.currentFor(user.id);
  }

  @ApiBearerAuth()
  @Get('me/payments')
  @ApiOperation({ summary: 'Historique des paiements' })
  history(@CurrentUser() user: AuthenticatedUser) {
    return this.subscriptions.history(user.id);
  }

  @ApiBearerAuth()
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Résilier en fin de période' })
  cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.subscriptions.cancel(user.id, id);
  }

  /**
   * Webhook Stripe.
   *
   * La signature est vérifiée sur le corps brut de la requête : sans cette
   * vérification, n'importe qui pourrait activer un abonnement Premium.
   */
  @Public()
  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Notification de paiement Stripe' })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!this.stripe || !webhookSecret) {
      throw new BadRequestException('Les webhooks Stripe ne sont pas configurés.');
    }
    if (!req.rawBody || !signature) {
      throw new BadRequestException('Signature Stripe manquante.');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Signature Stripe invalide.');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const reference = session.client_reference_id;
      if (reference) {
        await this.subscriptions.confirmPayment(reference, session.id, {
          eventId: event.id,
          type: event.type,
        });
      }
    }

    return { received: true };
  }

  /**
   * Webhook mobile money.
   *
   * Les opérateurs signent leurs notifications avec un secret partagé ; on
   * compare en temps constant pour éviter les attaques par timing.
   */
  @Public()
  @Post('webhooks/mobile-money')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Notification de paiement mobile money' })
  async mobileMoneyWebhook(
    @Body() body: { reference: string; providerRef: string; provider: string },
    @Headers('x-sencourrier-signature') signature: string,
  ) {
    const expected = this.config.get<string>('MOBILE_MONEY_WEBHOOK_SECRET');
    if (!expected || !signature || !timingSafeEqual(signature, expected)) {
      throw new BadRequestException('Signature de webhook invalide.');
    }

    await this.subscriptions.confirmPayment(body.reference, body.providerRef, {
      provider: body.provider,
    });

    return { received: true };
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}
