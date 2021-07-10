import express from 'express';
import {
  getThumbnail,
  getThumbnails
} from '../../controllers/api/s3ThumbnailController';

const s3ThumbnailRouter = express.Router();

// get images list
// api.k-peach.io/s3/thumbnail
s3ThumbnailRouter.get('/', getThumbnails);

// get a image
// api.k-peach.io/s3/thumbnail/{name}
s3ThumbnailRouter.get('/:name', getThumbnail);

export default s3ThumbnailRouter;
