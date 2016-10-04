import util from 'util';

function HttpError(code, message = '') {
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  this.code = code;
  this.message = message;
}

util.inherits(HttpError, Error);

HttpError.badRequest = msg => new HttpError(400, msg || 'Bad request');
HttpError.unauthorized = msg => new HttpError(401, msg || 'Unauthorized');
HttpError.forbidden = msg => new HttpError(403, msg || 'Forbidden');
HttpError.notFound = msg => new HttpError(404, msg || 'Not found');
HttpError.methodNotAllowed = msg => new HttpError(405, msg || 'Method not allowed');
HttpError.notAcceptable = msg => new HttpError(406, msg || 'Not acceptable');
HttpError.tooManyRequests = msg => new HttpError(429, msg || 'Too many requests');
HttpError.internalServerError = msg => new HttpError(500, msg || 'Internal server error');

export default HttpError;
