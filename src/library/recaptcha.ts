import axios from 'axios';
import { ICaptchaData, ICaptchaResponse } from 'src/types/captcha';

const secretKey = process.env.RECAPTCHA_SECRET;

export class Recaptcha {
  public async verify(token: string, ip: string): Promise<ICaptchaData> {
    try {
      const params = new URLSearchParams();
      params.append('secret', secretKey);
      params.append('response', token);
      params.append('remoteip', ip);
      const res = await axios.get<ICaptchaResponse>(
        'https://www.google.com/recaptcha/api/siteverify',
        { params },
      );
      return {
        success: res.data.success,
        challenge_ts: res.data.challenge_ts,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return {
        success: false,
        challenge_ts: new Date().toISOString(),
      };
    }
  }
}
