import axios from 'axios';
import express from 'express';

const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
  res.send('<h2>Welcome to Peach API</h2>');
});

rootRouter.get('/test', async (req, res) => {
  const options = {
    method: 'GET'
  };
  // score request to ai server
  try {
    const result = await axios(options);
    console.log(result.data);
    res.json(JSON.stringify(result.data));
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

export default rootRouter;
