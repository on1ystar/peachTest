import express from 'express';
import { getImages } from '../controllers/s3Controller';

const s3Router = express.Router();

s3Router.get('/s3', getImages);

export default s3Router;
