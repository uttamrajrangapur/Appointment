const jsonErrorHandler = async (err, req, res, next) => {
  res.status(err.status || 500).send({ error: {
    message: err.message,
    stack: err.stack
    } });
}
module.exports = jsonErrorHandler;