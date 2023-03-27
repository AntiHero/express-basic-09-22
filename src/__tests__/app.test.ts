import supertest from 'supertest';

import { app } from '../app';
import books, { Book } from '../fakeDb';

let api: supertest.SuperTest<supertest.Test>;

beforeEach(() => {
  api = supertest(app);
});

describe('teting API', () => {
  test('GET /books', async () => {
    expect.assertions(1);

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual(books);
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
});
