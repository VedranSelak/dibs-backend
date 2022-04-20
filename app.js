require("dotenv").config();
require("express-async-errors");

const express = require("express");
const logger = require("morgan");

// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const indexRouter = require("./routes/index");

const usersRouter = require("./routes/users");

const app = express();

const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1", indexRouter);
app.use("/api/v1/users", usersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log("Listening one port 3000");
});

module.exports = app;
