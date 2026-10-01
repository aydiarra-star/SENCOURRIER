import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@sencourrier/database';
import { NewsletterStatus } from '@sencourrier/types';
import { randomBytes } from 'node:crypto';
import { Resend } from 'resend';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);
  private readonly resend: Resend | null;

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    const apiKey = config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  /**
   * Inscription à la newsletter en double opt-in.
   *
   * Le statut reste `PENDING` jusqu'au clic sur le lien de confirmation : une
   * adresse saisie par erreur ou revendue par un tiers ne reçoit donc jamais
   * d'envoi.
   */
  async subscribe(email: string, interests: string[] = [], source = 'site') {
    const normalized = email.toLowerCase().trim();
    const confirmToken = randomBytes(32).toString('base64url');

    const subscriber = await this.prisma.newsletterSubscriber.upsert({
      where: { email: normalized },
      update: {
        status: NewsletterStatus.PENDING,
        interests,
        confirmToken,
        unsubscribedAt: null,
      },
      create: { email: normalized, interests, confirmToken, source },
      select: { id: true, email: true, status: true, confirmToken: true },
    });

    await this.sendConfirmationEmail(subscriber.email, subscriber.confirmToken!);

    // On ne renvoie jamais le jeton au client : il circule uniquement par e-mail.
    return { email: subscriber.email, status: subscriber.status };
  }

  async confirm(token: string) {
    const subscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { confirmToken: token },
      select: { id: true, status: true },
    });
    if (!subscriber) throw new NotFoundException('Lien de confirmation invalide ou déjà utilisé.');

    await this.prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: NewsletterStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmToken: null,
      },
    });

    return { confirmed: true };
  }

  async unsubscribe(token: string) {
    const subscriber = await this.prisma.newsletterSubscriber.findFirst({
      where: { confirmToken: token },
      select: { id: true },
    });
    if (!subscriber) throw new NotFoundException('Lien de désinscription invalide.');

    await this.prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { status: NewsletterStatus.UNSUBSCRIBED, unsubscribedAt: new Date(), confirmToken: null },
    });

    return { unsubscribed: true };
  }

  async stats() {
    const [confirmed, pending, unsubscribed] = await this.prisma.$transaction([
      this.prisma.newsletterSubscriber.count({ where: { status: NewsletterStatus.CONFIRMED } }),
      this.prisma.newsletterSubscriber.count({ where: { status: NewsletterStatus.PENDING } }),
      this.prisma.newsletterSubscriber.count({ where: { status: NewsletterStatus.UNSUBSCRIBED } }),
    ]);

    return { confirmed, pending, unsubscribed, total: confirmed + pending + unsubscribed };
  }

  private async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const siteUrl = this.config.get<string>('APP_URL', 'http://localhost:3000');
    const link = `${siteUrl}/newsletter/confirmation?token=${token}`;

    if (!this.resend) {
      this.logger.warn(`Resend non configuré — confirmation à valider manuellement : ${link}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: `${this.config.get<string>('MAIL_FROM_NAME', 'SENCOURRIER')} <${this.config.getOrThrow<string>('MAIL_FROM_EMAIL')}>`,
        to: email,
        replyTo: this.config.get<string>('MAIL_REPLY_TO'),
        subject: 'Confirmez votre inscription à la newsletter SENCOURRIER',
        html: this.confirmationTemplate(link),
      });
    } catch (error) {
      // L'inscription reste enregistrée : l'e-mail peut être renvoyé plus tard.
      this.logger.error(`Échec de l'envoi de confirmation : ${(error as Error).message}`);
    }
  }

  private confirmationTemplate(link: string): string {
    return `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1F2937">
        <div style="border-top:4px solid #00853F;padding:24px 0">
          <h1 style="font-size:20px;margin:0 0 16px">SENCOURRIER</h1>
          <p>Merci de votre intérêt pour le média numérique de référence du Sénégal.</p>
          <p>Cliquez sur le bouton ci-dessous pour confirmer votre inscription :</p>
          <p style="margin:28px 0">
            <a href="${link}" style="background:#00853F;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
              Confirmer mon inscription
            </a>
          </p>
          <p style="font-size:13px;color:#6B7280">
            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.
          </p>
        </div>
      </div>
    `;
  }
}
