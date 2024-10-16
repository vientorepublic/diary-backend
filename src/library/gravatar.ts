import { createHash } from 'crypto';

export class Gravatar {
  public get(email: string, size: number = 80): string {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}
