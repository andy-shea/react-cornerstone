import render from './src/client';
import load from './src/server/load';
import HttpError from './src/server/HttpError';

const err = new HttpError(404, 'not found');
console.log(err.notFound, HttpError.notFound());
