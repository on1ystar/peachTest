import express from 'express';
import shell from 'shelljs';
import AWS from 'aws-sdk';
import conf from '../config';

const s3TempRouter = express.Router();
const awsConfig = new AWS.Config({
  accessKeyId: conf.peachDev.accessKey,
  secretAccessKey: conf.peachDev.secretKey,
  region: conf.peachDev.region
});

const s3 = new AWS.S3(awsConfig);
const regex = /([^/]+)(\.[^./]+)$/g;

s3TempRouter.get('/', (req, res) => {
  const params = {
    Bucket: conf.bucket.data,
    Prefix: 'temp'
  };
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log('Error: ', err);
      return res
        .status(err.statusCode)
        .json({ success: 'false', errorMessage: err.message });
    }
    const mappedData = data.Contents.map(el => {
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
        format: el.Key.match(regex)[0].split('.')[1],
        path: `${conf.bucket.data}/${el.Key}`,
        size: el.Size,
        lastModified: el.LastModified
      };
    });
    return res.json({ success: 'true', data: mappedData });
  });
});

s3TempRouter.get('/:name', (req, res) => {
  const { name } = req.params;
  const params = {
    Bucket: conf.bucket.data,
    Key: `temp/${name}`
  };
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log('Error: ', err);
      return res
        .status(err.statusCode)
        .json({ success: 'false', errorMessage: err.message });
    }
    res.writeHead(200, { 'Content-Type': data.ContentType });
    res.write(data.Body);
    res.end();
    // return res.json({ success: 'true', data });
  });
});

s3TempRouter.post('/', (req, res) => {
  // upload a test image
  // contentTYpe : x-from
});

s3TempRouter.put('/:name', (req, res) => {
  // update a test image
});

s3TempRouter.delete('/:name', (req, res) => {
  // delete a test image
});

export default s3TempRouter;
