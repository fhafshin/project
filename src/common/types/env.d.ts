declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //Database;
      APP_PORT: number;
      DB_NAME: string;
      DB_PORT: number;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_TYPE: string;

      //Secrets;

      COOKIE_SECRET: string;
      OTP_TOKEN_SECRET: string;
    }
  }
}
