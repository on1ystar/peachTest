import helmet from 'helmet';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import rootRouter from './routers/rootRouter';

const app = express();
const logger = morgan('dev');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));

app.use(helmet());
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', rootRouter);

app.listen(80, () =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
