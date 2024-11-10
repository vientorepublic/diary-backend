declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      RECAPTCHA_SECRET: string;
      FRONTEND_HOST: string;
      JWT_SECRET: string;
      JWT_PERIOD: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_SECURE: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SMTP_SENDER_NAME: string;
      PAGE_SIZE: string;
    }
  }
}

export {};
