import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@sencourrier/database';
import { Resend } from 'resend';
import { PRISMA } from '../../infra/prisma/prisma.module';

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  topic?: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly resend: Resend | null;

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: ConfigService,
  ) {
    const apiKey = config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  /**
   * Les messages sont d'abord persistés, puis notifiés.
   *
   * Si l'envoi d'e-mail échoue, le message reste consultable dans le
   * back-office : aucune demande lecteur n'est perdue.
   */
  async submit(input: ContactInput) {
    const record = await this.prisma.contactMessage.create({
      data: {
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        subject: input.subject.trim(),
        message: input.message.trim(),
        topic: input.topic ?? 'general',
      },
      select: { id: true, createdAt: true },
    });

    await this.notifyEditorialTeam(input);

    return { id: record.id, receivedAt: record.createdAt };
  }

  async list(page = 1, perPage = 20, status?: string) {
    const where = status ? { status } : {};
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return { data: rows, meta: { page, perPage, total } };
  }

  private async notifyEditorialTeam(input: ContactInput): Promise<void> {
    if (!this.resend) {
      this.logger.warn('Resend non configuré — notification de contact non envoyée.');
      return;
    }

    try {
      await this.resend.emails.send({
        from: `${this.config.get<string>('MAIL_FROM_NAME', 'SENCOURRIER')} <${this.config.getOrThrow<string>('MAIL_FROM_EMAIL')}>`,
        to: this.config.get<string>('MAIL_REPLY_TO', 'redaction@sencourrier.sn'),
        replyTo: input.email,
        subject: `[Contact] ${input.subject}`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;color:#1F2937">
            <p><strong>Nom :</strong> ${escapeHtml(input.name)}</p>
            <p><strong>E-mail :</strong> ${escapeHtml(input.email)}</p>
            <p><strong>Rubrique :</strong> ${escapeHtml(input.topic ?? 'general')}</p>
            <hr />
            <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(`Échec de la notification de contact : ${(error as Error).message}`);
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
