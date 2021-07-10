import express from 'express';
import conf from '../../config';
import { s3, s3Client } from '../../config/s3';
import {
  getVoice,
  getVoices
} from '../../controllers/api/s3PerfectVoiceController';

const s3PerfectVoiceRouter = express.Router();

// get the perfect voices list
// api.k-peach.io/s3/perfect-voice
s3PerfectVoiceRouter.get('/', getVoices);

// get a perfect voice
// api.k-peach.io/s3/perfect-voice/{name}
s3PerfectVoiceRouter.get('/:name', getVoice);

export default s3PerfectVoiceRouter;
