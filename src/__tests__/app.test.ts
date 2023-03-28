/// <reference path="../types.d.ts" />
import type { Request, Response, NextFunction } from 'express';
// @ts-ignore
import supertestSession from 'supertest-session';
import * as dotenv from 'dotenv';
import supertest from 'supertest';
import mongoose from 'mongoose';

import { connectToMongoDB } from '../utils/connectToMongoDb';
import { requestLogger } from '../middlewares/logger';
import { Book } from '../models/book.model';
import { app } from '../app';

dotenv.config();

jest.mock('../middlewares/logger', () => {
  return {
    requestLogger: jest
      .fn()
      .mockImplementation((_: Request, __: Response, next: NextFunction) =>
        next()
      ),
  };
});

let api: supertest.SuperTest<supertest.Test>;

beforeEach(() => {
  api = supertest(app);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe.skip('teting API', () => {
  test('GET /books', async () => {
    expect.assertions(1);

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        // expect(res.body).toStrictEqual(books);
      });
  });

  test('POST /books', async () => {
    expect.assertions(2);

    const book: Omit<Book, 'id'> = {
      author: 'Kyle Simpson',
      title: "You don't know JS",
      year: 2010,
    };

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toHaveLength(3);
      });

    await api
      .post('/books')
      .send(book)
      .set('Accept', 'application/json')
      .expect(204);

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toEqual(expect.arrayContaining([{ ...book, id: 4 }]));
      });
  });

  test('GET /books should call requestLogger middleware', async () => {
    expect.assertions(1);

    await api.get('/books').expect(200);

    expect(requestLogger).toHaveBeenCalledTimes(1);
  });

  test('GET /counter should increase counter by 1', async () => {
    api = supertestSession(app);
    expect.assertions(2);

    await api.get('/counter').expect(200).expect('Content-Type', /text/);

    for (const cookie of api.cookies) {
      if (cookie.name === 'my-session') {
        expect(
          JSON.parse(Buffer.from(cookie.value, 'base64').toString()).counter
        ).toBe(0);
      }
    }

    expect(api.cookies.length).toBe(2);
  });
});

describe('testing MongoDB', () => {
  const books = [
    {
      author: 'Wuthering Heights',
      title: 'Pride and Prejudice',
      year: 2004,
    },
    {
      author: 'Edgar Alan Poe',
      title: 'The Raven',
      year: 1996,
    },
    {
      author: 'Boris Pasternak',
      title: 'Doctor Zhivago',
      year: 1997,
    },
  ];

  beforeEach(async () => {
    await connectToMongoDB(process.env.MONGODB_URL_TEST as string).catch(
      console.error
    );

    await Book.deleteMany({});
    await Book.insertMany(books);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /books', async () => {
    await api
      .get('/books')
      .expect(200)
      .expect('Content-type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual([
          { ...books[0], id: expect.anything() },
          { ...books[1], id: expect.anything() },
          { ...books[2], id: expect.anything() },
        ]);
      });
  });

  test('PUT /books/id', async () => {
    const book = await Book.create(books[0]);

    await api
      .put(`/books/${book._id}`)
      .send({ ...books[0], year: 1950 })
      .expect(200)
      .expect('Content-type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual({
          ...books[0],
          id: String(book._id),
          year: 1950,
        });
      });
  });
});
