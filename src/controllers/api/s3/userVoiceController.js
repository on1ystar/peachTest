import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import multer from 'multer';
import axios from 'axios';
import dbClient from '../../../dbConnect';
import { s3Client } from '../../../config/s3';
import getNow from '../../../date';
import conf from '../../../config';
import { middleMulter } from '../../../middlewares';

const PREFIX = 'user-voice';
const FORMAT = 'wav';
const regex = /([^/]+)(\.[^./]+)$/g;
const AI_SERVER_URL = `http://${conf.peachAi.ip}`;

export const getUserVoices = async (req, res) => {
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

export const getUserVoice = async (req, res) => {
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

export const uploadUserVoice = (req, res) => {
  middleMulter.single('uploadedFile')(req, res, async err => {
    // MulterError
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
    // audio/wav format error
    // if (!(req.file.mimetype in ['audio/wav', 'audio/vnd.wave'])) {
    //   console.log('mimetypeError');
    //   return res.status(400).json({
    //     success: 'false',
    //     errorMessage: 'You should upload "audio/wav" of mimetype'
    //   });
    // }
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
      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log('Success upload');

      const url = `${AI_SERVER_URL}/evaluation`;
      const options = {
        method: 'POST',
        data: {
          format: FORMAT,
          path: `${conf.bucket.data}/${uploadParams.Key}`,
          size: req.file.size
        },
        url
      };
      // score request to ai server
      try {
        const aiResponse = await axios(options);
        console.log('Success response to ai-server', aiResponse.data);

        const data = {
          name: uploadParams.Key.match(regex)[0].split('.')[0],
          format: FORMAT,
          path: `${conf.bucket.data}/${uploadParams.Key}`,
          size: req.file.size,
          translatedSentence: aiResponse.data.data.translatedSentence,
          score: aiResponse.data.data.score
        };

        // db에 발음 평가 결과 저장
        try {
          const query = {
            name: 'insertUserVoiceEvaluation',
            text: 'INSERT INTO admin_voice VALUES(default, 1, $1, $2, $3, now())',
            values: [data.path, data.translatedSentence, data.score]
          };
          await dbClient.query(query);
        } catch (err) {
          console.log('selectAdminByEmailError: ', err.stack);
          return res.status(502).end();
        }
        return res.json({
          success: 'true',
          data
        });
      } catch (error) {
        console.error('ReqeustToAIServerError: ', error.message);
      }
    } catch (err) {
      console.log('Error', err);
      return res
        .status(err.$metadata.httpStatusCode)
        .json({ success: 'false', errorMessage: err.message });
    }
  });
};
