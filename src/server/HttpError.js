import util from 'util';

function HttpError(code, message = '') {
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  this.code = code;
  this.message = message;
}

util.inherits(HttpError, Error);

HttpError.BAD_REQUEST = 400;
HttpError.UNAUTHORIZED = 401;
HttpError.FORBIDDEN = 403;
HttpError.NOT_FOUND = 404;
HttpError.METHOD_NOT_ALLOWED = 405;
HttpError.NOT_ACCEPTABLE = 406;
HttpError.TOO_MANY_REQUESTS = 429;
HttpError.INTERNAL_SERVER_ERROR = 500;

HttpError.badRequest = msg => new HttpError(HttpError.BAD_REQUEST, msg || 'Bad request');
HttpError.unauthorized = msg => new HttpError(HttpError.UNAUTHORIZED, msg || 'Unauthorized');
HttpError.forbidden = msg => new HttpError(HttpError.FORBIDDEN, msg || 'Forbidden');
HttpError.notFound = msg => new HttpError(HttpError.NOT_FOUND, msg || 'Not found');
HttpError.methodNotAllowed = msg => new HttpError(HttpError.METHOD_NOT_ALLOWED, msg || 'Method not allowed');
HttpError.notAcceptable = msg => new HttpError(HttpError.NOT_ACCEPTABLE, msg || 'Not acceptable');
HttpError.tooManyRequests = msg => new HttpError(HttpError.TOO_MANY_REQUESTS, msg || 'Too many requests');
HttpError.internalServerError = msg => new HttpError(HttpError.INTERNAL_SERVER_ERROR, msg || 'Internal server error');

export default HttpError;
