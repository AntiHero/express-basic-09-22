import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';

import { requestLogger } from './middlewares/logger';
import { idGenerator } from './utils/idGenerator';
import cookieSession from 'cookie-session';
import books from './fakeDb';

export const app = express();

// CORS
app.use(cors());

// body parser
app.use(express.json());

// cookies
const oneDay = 1000 * 60 * 60 * 24;

app.use(
  cookieSession({
    secret: 'sfajnh4faAN99', // required
    maxAge: oneDay,
    name: 'my-session',
  })
);

// custom middleware
// app.use(requestLogger);

// staitc
app.use(express.static('public'));

app.get('/books', requestLogger, (_, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);

  books[id - 1] ? res.json(books[id - 1]) : res.sendStatus(404);
});

app.post('/books', (req, res) => {
  const { author, title, year } = req.body;
  books.push({ id: idGenerator(), author, title, year });

  res.sendStatus(204);
});

app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id >= books.length) {
    res.sendStatus(404);
    return;
  }

  books[id - 1] = null;
  res.sendStatus(204);
});

app.get('/counter', (req, res) => {
  if (req.session) {
    if (req.session.counter === undefined) {
      req.session.counter = 0;
    } else {
      req.session.counter++;
    }
  }

  res.send(JSON.stringify(req?.session?.counter));
});

app.use('*', (_, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

app.use((_: Error, req: Request, res: Response, __: NextFunction) => {
  res.sendStatus(400);
});
