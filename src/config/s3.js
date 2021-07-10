import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import conf from './index';

const awsConfig = new AWS.Config({
  accessKeyId: conf.peachDev.accessKey,
  secretAccessKey: conf.peachDev.secretKey,
  region: conf.peachDev.region
});

export const s3 = new AWS.S3(awsConfig);
export const s3Client = new S3Client(awsConfig);
