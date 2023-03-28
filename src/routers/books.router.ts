import { isValidObjectId } from 'mongoose';
import { Router } from 'express';

import { toBookView } from '../utils/toBookView';
import { Book } from '../models/book.model';

export const booksRouter = Router();

booksRouter.get('/', async (_, res) => {
  try {
    const books = await Book.find().exec();

    res.status(200).json(books.map(toBookView));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    res.status(400).send('Not valid id');
    return;
  }

  try {
    const book = await Book.findById(id).exec();

    if (!book) return null;

    res.status(200).json(toBookView(book));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { author, title, year } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).send('Not valid id');
    return;
  }

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { author, title, year },
      { new: true }
    ).exec();

    if (!book) return null;
    res.status(200).json(toBookView(book));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    res.status(400).send('Not valid id');
    return;
  }

  try {
    await Book.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.post('/', async (req, res) => {
  const { author, title, year } = req.body;

  try {
    await Book.create({ author, title, year });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
