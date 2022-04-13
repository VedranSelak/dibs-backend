const errorHandler = (err, req, res, next) => {
  res.status(500).send("Internal server error");
};

module.exports = errorHandler;
