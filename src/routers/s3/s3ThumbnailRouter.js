import express from 'express';
import AWS from 'aws-sdk';
import conf from '../../config';

const s3ThumbnailRouter = express.Router();
const awsConfig = new AWS.Config({
  accessKeyId: conf.peachDev.accessKey,
  secretAccessKey: conf.peachDev.secretKey,
  region: conf.peachDev.region
});

const s3 = new AWS.S3(awsConfig);
const PREFIX = 'temp';
const FORMAT = 'jpg';
const regex = /([^/]+)(\.[^./]+)$/g;

// get images list
// api.k-peach.io/s3/temp
s3ThumbnailRouter.get('/', (req, res) => {
  s3.listObjectsV2(
    { Bucket: conf.bucket.data, Prefix: PREFIX },
    (err, data) => {
      if (err) {
        console.log('Error: ', err);
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

// get a image
// api.k-peach.io/s3/temp/{name}
s3ThumbnailRouter.get('/:name', (req, res) => {
  const { name } = req.params;
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
      // res.writeHead(200, { 'Content-Type': data.ContentType });
      // res.write(data.Body);
      // res.end();
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

export default s3ThumbnailRouter;
