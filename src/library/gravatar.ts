import { createHash } from 'crypto';

export class Gravatar {
  public email: string;
  constructor(email: string) {
    this.email = email;
  }
  public get(size: number = 80): string {
    const trimmedEmail = this.email.trim().toLowerCase();
    const hash = createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}
