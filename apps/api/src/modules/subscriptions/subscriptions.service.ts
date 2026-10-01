import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@sencourrier/database';
import {
  PaymentProvider,
  PaymentStatus,
  SubscriptionStatus,
  SubscriptionTier,
} from '@sencourrier/types';
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { PRISMA } from '../../infra/prisma/prisma.module';

export interface CheckoutResult {
  reference: string;
  provider: PaymentProvider;
  /** URL de paiement hébergée (Stripe) ou instructions USSD (mobile money). */
  paymentUrl: string | null;
  instructions?: string;
}

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private readonly stripe: Stripe | null;

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: ConfigService,
  ) {
    const secret = config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secret ? new Stripe(secret) : null;
  }

  async listPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        tier: true,
        name: true,
        description: true,
        priceAmount: true,
        currency: true,
        interval: true,
        features: true,
        isPopular: true,
        trialDays: true,
      },
    });
  }

  /**
   * Ouverture d'un paiement.
   *
   * Chaque opération crée d'abord une ligne `Payment` en statut `PENDING` avec
   * une référence interne : le webhook du fournisseur retrouve ainsi toujours
   * la commande, même si l'utilisateur abandonne puis reprend le parcours.
   */
  async startCheckout(userId: string, planId: string, provider: PaymentProvider): Promise<CheckoutResult> {
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { id: planId, isActive: true },
      select: { id: true, tier: true, name: true, priceAmount: true, currency: true, stripePriceId: true },
    });
    if (!plan) throw new NotFoundException('Formule d’abonnement introuvable.');

    const reference = `SC-${new Date().getFullYear()}-${randomUUID().slice(0, 12).toUpperCase()}`;

    await this.prisma.payment.create({
      data: {
        userId,
        provider,
        status: PaymentStatus.PENDING,
        amount: plan.priceAmount,
        currency: plan.currency,
        reference,
        payload: { planId: plan.id, tier: plan.tier },
      },
    });

    switch (provider) {
      case PaymentProvider.STRIPE:
        return this.startStripeCheckout(reference, plan, userId);
      case PaymentProvider.WAVE:
        return this.startWaveCheckout(reference, plan);
      case PaymentProvider.ORANGE_MONEY:
        return this.startOrangeMoneyCheckout(reference, plan);
      case PaymentProvider.FREE_MONEY:
        return this.startFreeMoneyCheckout(reference, plan);
      default:
        throw new NotFoundException('Moyen de paiement non pris en charge.');
    }
  }

  /**
   * Confirmation d'un paiement.
   *
   * L'abonnement n'est activé qu'ici : c'est le point unique où l'état passe
   * de `PENDING` à `SUCCEEDED`, appelé exclusivement par les webhooks signés.
   */
  async confirmPayment(reference: string, providerRef: string, rawPayload?: unknown) {
    const payment = await this.prisma.payment.findUnique({
      where: { reference },
      select: { id: true, userId: true, payload: true, status: true, amount: true, currency: true },
    });
    if (!payment) throw new NotFoundException('Paiement introuvable.');
    if (payment.status === PaymentStatus.SUCCEEDED) return { alreadyProcessed: true };

    const planId = (payment.payload as { planId?: string } | null)?.planId;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          providerRef,
          paidAt: new Date(),
          payload: { ...(payment.payload as object), webhook: rawPayload ?? null },
        },
      });

      if (!planId) return;

      const plan = await tx.subscriptionPlan.findUnique({
        where: { id: planId },
        select: { tier: true, interval: true, trialDays: true },
      });
      if (!plan) return;

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + (plan.interval === 'year' ? 12 : 1));

      const subscription = await tx.subscription.create({
        data: {
          userId: payment.userId,
          planId,
          tier: plan.tier,
          status: plan.trialDays > 0 ? SubscriptionStatus.TRIALING : SubscriptionStatus.ACTIVE,
          provider: providerRef.startsWith('cs_') ? PaymentProvider.STRIPE : null,
          providerRef,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
          trialEndsAt: plan.trialDays > 0 ? new Date(Date.now() + plan.trialDays * 86_400_000) : null,
        },
        select: { id: true },
      });

      await tx.payment.update({ where: { id: payment.id }, data: { subscriptionId: subscription.id } });

      // L'abonnement Premium ouvre les droits éditoriaux correspondants.
      if (plan.tier !== SubscriptionTier.FREE) {
        await tx.user.update({
          where: { id: payment.userId },
          data: { role: 'PREMIUM_SUBSCRIBER' },
        });
      }

      await tx.invoice.create({
        data: {
          userId: payment.userId,
          subscriptionId: subscription.id,
          paymentId: payment.id,
          number: `FA-${reference}`,
          amount: payment.amount,
          currency: payment.currency,
          paidAt: new Date(),
        },
      });
    });

    return { confirmed: true };
  }

  async cancel(userId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, userId },
      select: { id: true },
    });
    if (!subscription) throw new NotFoundException('Abonnement introuvable.');

    // Résiliation en fin de période : l'accès reste ouvert jusqu'à l'échéance.
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });

    return { cancelAtPeriodEnd: true };
  }

  async currentFor(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        tier: true,
        status: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        trialEndsAt: true,
        plan: { select: { name: true, priceAmount: true, currency: true, interval: true } },
      },
    });
  }

  async history(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: {
        id: true,
        reference: true,
        provider: true,
        status: true,
        amount: true,
        currency: true,
        paidAt: true,
        createdAt: true,
      },
    });
  }

  private async startStripeCheckout(
    reference: string,
    plan: { stripePriceId: string | null; name: string },
    userId: string,
  ): Promise<CheckoutResult> {
    if (!this.stripe || !plan.stripePriceId) {
      return {
        reference,
        provider: PaymentProvider.STRIPE,
        paymentUrl: null,
        instructions:
          'Stripe n’est pas encore activé sur cet environnement. Le paiement sera disponible prochainement.',
      };
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      customer_email: user?.email,
      client_reference_id: reference,
      success_url: `${this.config.get('APP_URL')}/abonnement/succes?ref=${reference}`,
      cancel_url: `${this.config.get('APP_URL')}/abonnement?annule=1`,
    });

    return { reference, provider: PaymentProvider.STRIPE, paymentUrl: session.url };
  }

  private async startWaveCheckout(
    reference: string,
    plan: { priceAmount: number; name: string },
  ): Promise<CheckoutResult> {
    const apiKey = this.config.get<string>('WAVE_API_KEY');
    if (!apiKey) return this.mobileMoneyFallback(reference, PaymentProvider.WAVE, plan.name);

    try {
      const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: String(plan.priceAmount),
          currency: 'XOF',
          client_reference: reference,
          success_url: `${this.config.get('APP_URL')}/abonnement/succes?ref=${reference}`,
          error_url: `${this.config.get('APP_URL')}/abonnement?erreur=1`,
        }),
      });

      if (!response.ok) throw new Error(`Wave a répondu ${response.status}`);

      const session = (await response.json()) as { wave_launch_url?: string };
      return { reference, provider: PaymentProvider.WAVE, paymentUrl: session.wave_launch_url ?? null };
    } catch (error) {
      this.logger.error(`Échec Wave : ${(error as Error).message}`);
      return this.mobileMoneyFallback(reference, PaymentProvider.WAVE, plan.name);
    }
  }

  private async startOrangeMoneyCheckout(
    reference: string,
    plan: { priceAmount: number; name: string },
  ): Promise<CheckoutResult> {
    const clientId = this.config.get<string>('ORANGE_MONEY_CLIENT_ID');
    if (!clientId) return this.mobileMoneyFallback(reference, PaymentProvider.ORANGE_MONEY, plan.name);

    // Orange Money Sénégal : paiement par validation USSD sur le téléphone.
    return {
      reference,
      provider: PaymentProvider.ORANGE_MONEY,
      paymentUrl: null,
      instructions: `Composez #144# sur votre téléphone Orange, choisissez « Paiement marchand », puis saisissez la référence ${reference} (${plan.priceAmount} FCFA).`,
    };
  }

  private async startFreeMoneyCheckout(
    reference: string,
    plan: { priceAmount: number; name: string },
  ): Promise<CheckoutResult> {
    const apiKey = this.config.get<string>('FREE_MONEY_API_KEY');
    if (!apiKey) return this.mobileMoneyFallback(reference, PaymentProvider.FREE_MONEY, plan.name);

    return {
      reference,
      provider: PaymentProvider.FREE_MONEY,
      paymentUrl: null,
      instructions: `Composez #555# sur votre téléphone Free, choisissez « Paiement », puis saisissez la référence ${reference} (${plan.priceAmount} FCFA).`,
    };
  }

  private mobileMoneyFallback(
    reference: string,
    provider: PaymentProvider,
    planName: string,
  ): CheckoutResult {
    return {
      reference,
      provider,
      paymentUrl: null,
      instructions: `Formule ${planName} enregistrée. Le paiement mobile money sera activé prochainement ; conservez la référence ${reference}.`,
    };
  }
}
