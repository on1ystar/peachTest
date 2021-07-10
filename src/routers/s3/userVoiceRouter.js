import express from 'express';
import {
  getUVoice,
  getUVoices,
  uploadUVoice
} from '../../controllers/api/s3UserVoiceController';

const userVoiceRouter = express.Router();

// get the user voices list
// api.k-peach.io/user-voice
userVoiceRouter.get('/', getUVoices);

// get a user voice
// api.k-peach.io/user-voice/{name}
userVoiceRouter.get('/:name', getUVoice);

// upload a user voice
// api.k-peach.io/user-voice/
userVoiceRouter.post('/', uploadUVoice);

export default userVoiceRouter;
