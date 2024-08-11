declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number;
      DB_NAME: string;
      DB_PORT: number;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_TYPE: string;
    }
  }
}
