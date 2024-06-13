import { HttpError } from '../errors/http.error.js';

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const errorClasses = Object.values(HttpError);
  const errorInstance = errorClasses.find((errorClass) => err instanceof errorClass);

  if (errorInstance) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof Error && err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: '예상치 못한 에러가 발생하였습니다.' });
};

export { globalErrorHandler };
