import express from 'express';
import shell from 'shelljs';

const s3TempRouter = express.Router();

s3TempRouter.get('/s3', (req, res) => {
  shell.exec;
  return res.json();
});

s3TempRouter.get('/s3/1', (req, res) => {
  // get a test image
  // id: 1
});

s3TempRouter.post('/s3', (req, res) => {
  // upload a test image
  // contentTYpe : x-from
});

s3TempRouter.put('/s3/:id', (req, res) => {
  // update a test image
});

s3TempRouter.delete('/s3/:id', (req, res) => {
  // delete a test image
});

export default s3TempRouter;
