import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import multer from 'multer';
import { s3Client } from '../../../config/s3';
import getNow from '../../../date';
import conf from '../../../config';
import { middleMulter } from '../../../middlewares';

const PREFIX = 'user-voice';
const FORMAT = 'wav';
const regex = /([^/]+)(\.[^./]+)$/g;

export const getUVoices = async (req, res) => {
  const bucketParams = { Bucket: conf.bucket.data, Prefix: PREFIX };

  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
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
  } catch (err) {
    console.log('Error: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};

export const getUVoice = async (req, res) => {
  const { name } = req.params;
  const bucketParams = {
    Bucket: conf.bucket.data,
    Key: `${PREFIX}/${name}.${FORMAT}`
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const obj = {
      name,
      format: FORMAT,
      path: `${conf.bucket.data}/${bucketParams.Key}`,
      size: data.ContentLength,
      lastModified: data.LastModified
    };
    return res.json({ success: 'true', data: obj });
  } catch (err) {
    console.log('Error: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};

export const uploadUVoice = (req, res) => {
  middleMulter.single('uploadedFile')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res
        .status(400)
        .json({ success: 'false', errorMessage: err.message });
    }
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: 'false', errorMessage: err.message });
    }
    if (req.file.mimetype !== 'audio/wav') {
      return res.status(400).json({
        success: 'false',
        errorMessage: 'You should upload "audio/wav" of mimetype'
      });
    }
    const bucketParams = { Bucket: conf.bucket.data, Prefix: PREFIX };
    try {
      // for userVoices counts
      const userVoices = await s3Client.send(
        new ListObjectsCommand(bucketParams)
      );
      const date = getNow();

      const uploadParams = {
        Bucket: conf.bucket.data,
        Key: `${PREFIX}/${date}-${userVoices.Contents.length - 1}.${FORMAT}`,
        Body: req.file.buffer,
        ACL: 'public-read'
      };
      const data = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log('Success', data);
      return res.json({
        success: 'true',
        data: {
          name: uploadParams.Key.match(regex)[0].split('.')[0],
          format: FORMAT,
          path: `${conf.bucket.data}/${uploadParams.Key}`,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (err) {
      console.log('Error', err);
      return res
        .status(err.$metadata.httpStatusCode)
        .json({ success: 'false', errorMessage: err.message });
    }
  });
};
