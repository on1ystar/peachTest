import express from 'express';
import { upload } from '../../controllers/api/s3UserVoiceController';

const s3UserVoiceRouter = express.Router();

// upload a user voice
// api.k-peach.io/s3/user-voice/
s3UserVoiceRouter.post('/', upload);

export default s3UserVoiceRouter;
