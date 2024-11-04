const errorMiddleware = {
  notFound: (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  },

  errorHandler: (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
};

module.exports = errorMiddleware;
