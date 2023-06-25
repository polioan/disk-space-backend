declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      USER_DATA_PATHNAME: string;
      STORAGE_SIZE: string;
      STORAGE_SIZE_LIMIT: string;
    }
  }
}

export {}
