import express from 'express';
import shell from 'shelljs';
import AWS from 'aws-sdk';

const s3TempRouter = express.Router();
const awsConfig = new AWS.Config({
  accessKeyId: config.peachDev.accessKey,
  secretAccessKey: config.peachDev.secretKey,
  region: config.peachDev.region
});

const s3 = new AWS.S3(awsConfig);

s3TempRouter.get('/s3/temp', (req, res) => {
  const 
  return res.json();
});

s3TempRouter.get('/s3/temp/1', (req, res) => {
  // get a test image
  // id: 1
});

s3TempRouter.post('/s3/temp', (req, res) => {
  // upload a test image
  // contentTYpe : x-from
});

s3TempRouter.put('/s3/temp/:id', (req, res) => {
  // update a test image
});

s3TempRouter.delete('/s3/temp/:id', (req, res) => {
  // delete a test image
});

export default s3TempRouter;
