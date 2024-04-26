import 'dotenv/config';

import YAML from 'yaml';
import { errorHandler } from './middleware/errorHandler';
import express from 'express';
import fs from 'fs';
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve Swagger Docs
const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);

app.use(routes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
