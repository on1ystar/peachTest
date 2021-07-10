import express from 'express';
import conf from '../../config';
import { s3, s3Client } from '../../config/s3';
import {
  getPVoice,
  getPVoices
} from '../../controllers/api/s3PerfectVoiceController';

const perfectVoiceRouter = express.Router();

// get the perfect voices list
// api.k-peach.io/perfect-voice
perfectVoiceRouter.get('/', getPVoices);

// get a perfect voice
// api.k-peach.io/perfect-voice/{name}
perfectVoiceRouter.get('/:name', getPVoice);

export default perfectVoiceRouter;
