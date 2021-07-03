import AWS from 'aws-sdk';
import config from '../src/config';

const awsConfig = new AWS.Config({
  accessKeyId: config.peachDev.accessKey,
  secretAccessKey: config.peachDev.secretKey,
  region: config.peachDev.region
});

const s3 = new AWS.S3(awsConfig);
const bucketParams = {
  Bucket: config.bucket.test
};

s3.listBuckets((err, data) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data.Buckets);
  }
});

s3.listObjects(bucketParams, (err, data) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data);
  }
});
