declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: 'development' | 'production';

    // Port settings
    PORT?: string;

    // Application settings
    APP_NAME?: string;

    // Dataabase URL
    DATABASE_URL?: string;

    // Application domains
    FRONTEND_DOMAIN?: string;
    BACKEND_DOMAIN?: string;

    // JWT
    JWT_KEY?: string;
    JWT_EXPIRATION?: string;

    // Redis
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASS?: string;

    // Throttle
    THROTTLE_TTL?: string;
    THROTTLE_LIMIT?: string;

    // Mail
    MAIL_HOST?: string;
    MAIL_USER?: string;
    MAIL_PASS?: string;
    MAIL_PORT?: string;
    MAIL_SSL?: string;
    MAIL_FROM?: string;

    // Storage
    STORAGE_TYPE?: 'local' | 's3';

    // AWS
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_REGION?: string;
    AWS_S3_BUCKET?: string;
  }
}
