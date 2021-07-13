import dotenv from 'dotenv';

dotenv.config();

const conf = {
  peachApi: {
    accessKey: process.env.PEACH_API_ACCESS_KEY_ID,
    secretKey: process.env.PEACH_API_SECRET_ACCESS_KEY,
    region: process.env.PEACH_API_REGION
  },
  bucket: {
    test: process.env.BUCKET_TEST,
    data: process.env.BUCKET_DATA
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pw: process.env.DB_PW,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT
  }
};

export default conf;
