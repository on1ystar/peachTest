import helmet from 'helmet';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import rootRouter from './routers/rootRouter';
import thumbnailRouter from './routers/api/s3/thumbnailRouter';
import perfectVoiceRouter from './routers/api/s3/perfectVoiceRouter';
import userVoiceRouter from './routers/api/s3/userVoiceRouter';
import adminRouter from './routers/api/auth/adminRouter';

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
app.use('/thumbnail', thumbnailRouter);
app.use('/perfect-voice', perfectVoiceRouter);
app.use('/user-voice', userVoiceRouter);
app.use('/auth/admin', adminRouter);

app.listen(80, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
