require("dotenv").config();
require("express-async-errors");

const express = require("express");
const logger = require("morgan");

// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const usersRouter = require("./src/routes/users");
const authRouter = require("./src/routes/auth");

const app = express();
const ip = require("ip");

const notFoundMiddleware = require("./src/middleware/notFound");
const errorHandlerMiddleware = require("./src/middleware/errorHandler");
const authorizationMiddleware = require("./src/middleware/auth");

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

// DB Connection
require("./src/db/connection");

app.listen(3000, () => {
  console.log("Listening one port 3000");
  console.log("With IP: ", ip.address());
});

module.exports = app;
