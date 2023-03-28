import { Schema, model } from 'mongoose';

export interface Book {
  title: string;
  author: string;
  year: number;
}

const bookSchema = new Schema<Book>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
});

export const Book = model<Book>('Book', bookSchema);
