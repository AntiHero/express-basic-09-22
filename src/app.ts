import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';

import { booksRouter } from './routers/books.router';
import cookieSession from 'cookie-session';

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
if (process.env.DEPLOY_TO_VERCEL !== 'true') {
  app.use(express.static('./public'));
}
app.use('/books', booksRouter);

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
