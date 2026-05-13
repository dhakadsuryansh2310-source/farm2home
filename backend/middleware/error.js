const fs = require('fs');

const errorHandler = (err, req, res, next) => {
  try {
    fs.appendFileSync('error_log.txt', new Date().toISOString() + ' - ' + (err.stack || err.message || err) + '\n');
  } catch (e) {}
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
