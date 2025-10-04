import { config } from 'dotenv';
config();

/** @type {import('kanel').Config} */
export default {
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
  },

  preDeleteModelFolder: true,
  outputPath: './src/schemas',

  customTypeMap: {
    'pg_catalog.tsvector': 'string',
    'pg_catalog.bpchar': 'string'
  }
};