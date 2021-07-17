import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../config/s3';
import conf from '../../../config';

const PREFIX = 'perfect-voice';
const FORMAT = 'wav';
const regex = /([^/]+)(\.[^./]+)$/g;

export const getPerfectVoices = async (req, res) => {
  const bucketParams = { Bucket: conf.bucket.data, Prefix: PREFIX };

  try {
    // data 변수 이름 수정(data는 광범위)
    const perfectVoices = await s3Client.send(
      new ListObjectsCommand(bucketParams)
    );
    const mappedData = perfectVoices.Contents.map(el => {
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
    // error 별로 구분 -> 어떤 에러인지
    console.log('Error: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};

export const getPerfectVoice = async (req, res) => {
  const { name } = req.params;
  const bucketParams = {
    Bucket: conf.bucket.data,
    Key: `${PREFIX}/${name}.${FORMAT}`
  };

  try {
    const perfectVoice = await s3Client.send(
      new GetObjectCommand(bucketParams)
    );
    const obj = {
      name,
      format: FORMAT,
      path: `${conf.bucket.data}/${bucketParams.Key}`,
      size: perfectVoice.ContentLength,
      lastModified: perfectVoice.LastModified
    };
    return res.json({ success: 'true', data: obj });
  } catch (err) {
    console.log('Error: ', err);
    return res
      .status(err.$metadata.httpStatusCode)
      .json({ success: 'false', errorMessage: err.message });
  }
};
