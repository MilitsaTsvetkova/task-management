import * as joi from '@hapi/joi';

export const configSchema = joi.object({
  PORT: joi.number().default(3000),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().default(5432).required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_DATABASE: joi.string().required(),
  STAGE: joi.string().required(),
  JWT_SECRET: joi.string().required(),
});
