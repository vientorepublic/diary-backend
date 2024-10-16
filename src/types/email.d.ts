export interface IEmailLocale {
  brand: string;
  title: string;
  username: string;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  link?: string;
}

export interface IEmailParams {
  subject: string;
}
