import express from 'express';
import {
  getPVoice,
  getPVoices
} from '../../../controllers/api/s3/perfectVoiceController';
import { middleAuth } from '../../../middlewares';

const perfectVoiceRouter = express.Router();

// get the perfect voices list
// api.k-peach.io/perfect-voice
perfectVoiceRouter.get('/', middleAuth, getPVoices);

// get a perfect voice
// api.k-peach.io/perfect-voice/{name}
perfectVoiceRouter.get('/:name', middleAuth, getPVoice);

export default perfectVoiceRouter;
