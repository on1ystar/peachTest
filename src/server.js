import helmet from 'helmet';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import rootRouter from './routers/rootRouter';
import s3ThumbnailRouter from './routers/s3/s3ThumbnailRouter';
import s3PerfectVoiceRouter from './routers/s3/s3PerfectVoiceRouter';

const app = express();
const logger = morgan('dev');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));

app.use(helmet());
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', rootRouter);
app.use('/s3/thumbnail', s3ThumbnailRouter);
app.use('/s3/perfect-voice', s3PerfectVoiceRouter);

app.listen(80, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
