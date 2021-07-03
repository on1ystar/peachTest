import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

const PORT = process.env.DEV_PORT;

const app = express();
const logger = morgan('dev');

app.use(helmet());
app.use(logger);
app.get('/', (req, res) => res.send('Welcome to peach !'));

app.listen(PORT, () =>
  console.log(`✅ Server listening on api.k-peach.io:${PORT}/`)
);
