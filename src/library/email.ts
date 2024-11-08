import type { IEmailLocale, IEmailParams } from 'src/types/email';
import { type Transporter, createTransport } from 'nodemailer';
import type { Options } from 'nodemailer/lib/mailer';
import { Logger } from '@nestjs/common';
import { decode } from 'html-entities';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

export class Email {
  public address: string;
  public transporter: Transporter;
  private logger = new Logger('EMAIL');
  constructor(address: string) {
    this.address = address;
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  public async send(
    params: IEmailParams,
    replacements: IEmailLocale,
  ): Promise<void> {
    const template = readFileSync(
      join(__dirname, '..', '..', 'templates', 'email.html'),
      {
        encoding: 'utf-8',
      },
    );
    const html = compile(template);
    const options: Options = {
      from: `${process.env.SMTP_SENDER_NAME} <${process.env.SMTP_USER}>`,
      to: this.address,
      subject: decode(params.subject),
      html: html(replacements),
    };
    try {
      const result = await this.transporter.sendMail(options);
      this.logger.log(
        `${result.accepted}, ${result.rejected} - ${result.response}, [message-id: ${result.messageId}]`,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
