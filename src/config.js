import dotenv from 'dotenv';

dotenv.config();

//get config from environment
export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.WEVA_MONGO_URL,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
  FB_APP_ID: process.env.FB_APP_ID,
  AK_APP_SECRET: process.env.AK_APP_SECRET,
  BRANCH_KEY: process.env.BRANCH_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  MESSENGER_BACKEND: process.env.MESSENGER_BACKEND,
  MESSENGER_APP_ID: process.env.MESSENGER_APP_ID,
  MESSENGER_APP_SECRET: process.env.MESSENGER_APP_SECRET,
  VERSION: process.env.VERSION,
  VERSION_TOKEN: process.env.VERSION_TOKEN,
  FIREBASE: process.env.FIREBASE,
  AWS_REGION: process.env.AWS_REGION,
  EMAIL_SOURCE: process.env.EMAIL_SOURCE,
  ZALO_API: process.env.ZALO_API,
};
