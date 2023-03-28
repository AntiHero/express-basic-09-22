import { Document } from 'mongoose';

import { Book } from '../models/book.model';
import { BookViewModel } from '../common/types';

interface BookType extends Document, Book {}

export const toBookView = (doc: BookType): BookViewModel => {
  return {
    id: String(doc._id),
    author: doc.author,
    title: doc.title,
    year: doc.year,
  };
};
