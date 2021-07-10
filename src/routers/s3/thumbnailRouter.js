import express from 'express';
import {
  getThumbnail,
  getThumbnails
} from '../../controllers/api/s3ThumbnailController';

const thumbnailRouter = express.Router();

// get images list
// api.k-peach.io/thumbnail
thumbnailRouter.get('/', getThumbnails);

// get a image
// api.k-peach.io/thumbnail/{name}
thumbnailRouter.get('/:name', getThumbnail);

export default thumbnailRouter;
