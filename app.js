require("dotenv").config();
require("express-async-errors");

const express = require("express");
const logger = require("morgan");

// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");
const authorizationMiddleware = require("./middleware/auth");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1", authRouter);
app.use("/api/v1/users", authorizationMiddleware, usersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log("Listening one port 3000");
});

module.exports = app;
