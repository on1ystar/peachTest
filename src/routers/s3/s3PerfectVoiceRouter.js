import express from 'express';
import AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { path } from 'path';
import conf from '../../config';

const fs = require('fs');

const s3PerfectVoiceRouter = express.Router();

const awsConfig = new AWS.Config({
  accessKeyId: conf.peachDev.accessKey,
  secretAccessKey: conf.peachDev.secretKey,
  region: conf.peachDev.region
});

const s3 = new AWS.S3(awsConfig);
const s3Client = new S3Client(awsConfig);
const PREFIX = 'perfect-voice';
const FORMAT = 'wav';
const regex = /([^/]+)(\.[^./]+)$/g;

// get the perfect voices list
// api.k-peach.io/s3/perfect-voice
s3PerfectVoiceRouter.get('/', (req, res) => {
  s3.listObjectsV2(
    { Bucket: conf.bucket.data, Prefix: PREFIX },
    (err, data) => {
      if (err) {
        console.log('Error: '.err);
        return res
          .status(err.statusCode)
          .json({ success: 'false', errorMessage: err.message });
      }
      const mappedData = data.Contents.map(el => {
        // bucket folder
        if (el.Size === 0) {
          return {
            name: '',
            format: '',
            path: `${conf.bucket.data}/${el.Key}`,
            size: el.Size,
            lastModified: el.LastModified
          };
        }
        return {
          name: el.Key.match(regex)[0].split('.')[0],
          format: FORMAT,
          path: `${conf.bucket.data}/${el.Key}`,
          size: el.Size,
          lastModified: el.LastModified
        };
      });
      return res.json({ success: 'true', data: mappedData });
    }
  );
});

// get a perfect voice
// api.k-peach.io/s3/perfect-voice/{key}
s3PerfectVoiceRouter.get('/:name', (req, res) => {
  const { name } = req.params;
  console.log(name);
  s3.getObject(
    {
      Bucket: conf.bucket.data,
      Key: `${PREFIX}/${name}`
    },
    (err, data) => {
      if (err) {
        console.log('Error: ', err);
        return res
          .status(err.statusCode)
          .json({ success: 'false', errorMessage: err.message });
      }
      const obj = {
        name,
        format: FORMAT,
        path: `${conf.bucket.data}/${PREFIX}/${name}`,
        size: data.ContentLength,
        lastModified: data.LastModified
      };
      return res.json({ success: 'true', data: obj });
    }
  );
});

s3PerfectVoiceRouter.post('/', async (req, res) => {
  const file = '/home/ubuntu/peachTest/src/routers/s3/test.txt';
  const fileStream = fs.createReadStream(file);
  console.log(fileStream);

  const uploadParams = {
    Bucket: conf.bucket.data,
    Key: `${PREFIX}/test.wav`,
    Body: fileStream
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Success', data);
    return res.send('success');
  } catch (err) {
    console.log('Error', err);
  }
});

export default s3PerfectVoiceRouter;
