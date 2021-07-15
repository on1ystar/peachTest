import express from 'express';
import {
  getUVoice,
  getUVoices,
  uploadUVoice
} from '../../../controllers/api/s3/userVoiceController';
import { middleAuth } from '../../../middlewares';

const userVoiceRouter = express.Router();

// get the user voices list
// api.k-peach.io/user-voice
userVoiceRouter.get('/', middleAuth, getUVoices);

// get a user voice
// api.k-peach.io/user-voice/{name}
userVoiceRouter.get('/:name', middleAuth, getUVoice);

// upload a user voice
// api.k-peach.io/user-voice/
userVoiceRouter.post('/', middleAuth, uploadUVoice);

export default userVoiceRouter;
