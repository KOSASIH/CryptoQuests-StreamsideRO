const { HttpError } = require('http-errors');

const handleError = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
};

const handleValidationError = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400);
  res.json({ error: err.message });
};

const handleCastError = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400);
  res.json({ error: 'Invalid ID' });
};

const handleJWTError = () => {
  const err = new HttpError(401, 'Unauthorized');
  err.status = 401;
  return err;
};

const handleTokenExpiredError = () => {
  const err = new HttpError(401, 'Token expired');
  err.status = 401;
  return err;
};

module.exports = {
  handleError,
  handleValidationError,
  handleCastError,
  handleJWTError,
  handleTokenExpiredError,
};
