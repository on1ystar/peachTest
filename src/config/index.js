import dotenv from 'dotenv';

dotenv.config();

const conf = {
  devPort: process.env.DEV_PORT,
  peachDev: {
    accessKey: process.env.PEACH_DEV_ACCESS_KEY_ID,
    secretKey: process.env.PEACH_DEV_SECRET_ACCESS_KEY,
    region: process.env.PEACH_DEV_REGION
  },
  bucket: {
    test: process.env.BUCKET_TEST,
    data: process.env.BUCKET_DATA
  }
};

export default conf;
