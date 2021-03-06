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
const listingRouter = require("./src/routes/listings");
const reservationRouter = require("./src/routes/reservations");
const roomRouter = require("./src/routes/rooms");
const inviteRouter = require("./src/routes/invites");

const app = express();

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
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reservations", reservationRouter);
app.use("/api/v1/rooms", authorizationMiddleware, roomRouter);
app.use("/api/v1/invites", authorizationMiddleware, inviteRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// DB Connection
require("./src/db/connection");

module.exports = app;
