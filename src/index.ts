import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';

const PORT = 9000;

const app = express();

// CORS
app.use(cors());

// body parser
app.use(express.json());

// template engine setup
app.set('views', 'views');
app.set('view engine', 'pug');

// static
app.use(express.static('static'));

app.get('/', (_, res) => {
  res.render('index', { title: 'Pug Template' });
});

app.use('*', (_, res) => {
  res.render('index', { title: 'Pug Template' });
});

app.use((_: Error, req: Request, res: Response, __: NextFunction) => {
  res.sendStatus(400);
});

app.listen(PORT, () => {
  console.log('Server is listening at http://localhost:%s', PORT);
});
