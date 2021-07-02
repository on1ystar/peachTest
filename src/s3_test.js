import 'dotenv/config';
import AWS from 'aws-sdk';

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2'
});

const s3 = new AWS.S3();

s3.listBuckets((err, data) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data.Buckets);
  }
});
