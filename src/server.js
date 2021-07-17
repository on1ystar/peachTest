/*
- PrgName : server.js at peach-api  
- Date : 2021. 07. 18 
- Creator : 정성진 ( tjdwls0607@naver.com )
- Version : v0.1.0 
- Description : peach API back-end server 
- Usage 
1) startup : sudo npm run dev:server
2) build : sudo npm run build:server
3) pm2 for dev : sudo npm run pm2:dev
4) pm2 for product : sudo npm run pm2:prod
5) stop : ^c (or sudo pm2 stop all)
6) api-docs : sudo npm run api:docs
*/
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
app.use('/api/s3/thumbnail', thumbnailRouter);
app.use('/api/s3/perfect-voice', perfectVoiceRouter);
app.use('/api/s3/user-voice', userVoiceRouter);
app.use('/api/auth/admin', adminRouter);

app.listen(80, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
