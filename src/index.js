import express from 'express';

const PORT = 4000;

const app = express();

app.get('/', (req, res) => res.send('Welcome to peach !'));  

app.listen(PORT, () =>
  console.log(`✅ Server listening on test.peach.io:${PORT}/`)
);