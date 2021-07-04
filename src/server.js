import helmet from 'helmet';
import express from 'express';
import morgan from 'morgan';
import rootRouter from './routers/rootRouter';

const app = express();
const logger = morgan('dev');

app.use(helmet());
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use('/', rootRouter);

app.listen(80, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
