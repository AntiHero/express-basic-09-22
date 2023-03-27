import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';

import { idGenerator } from './utils/idGenerator';
import books from './fakeDb';

const PORT = 9000;

const app = express();

// CORS
app.use(cors());

// body parser
app.use(express.json());

// staitc
app.use(express.static('public'));

app.get('/books', (_, res) => {
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

app.use('*', (_, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

app.use((_: Error, req: Request, res: Response, __: NextFunction) => {
  res.sendStatus(400);
});

app.listen(PORT, () => {
  console.log('Server is listening at http://localhost:%s', PORT);
});
