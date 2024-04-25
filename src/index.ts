import 'dotenv/config';

import express from 'express';
import routes from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.send('Hi Everyone.');
});

app.use(routes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
