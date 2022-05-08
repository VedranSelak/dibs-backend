const db = require("../db/connection");
const { BadRequest, Unauthenticated } = require("../errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const User = db.users;
const PublicListing = db.publicListings;

const signUp = async (req, res) => {
  const { email, firstName, lastName, password, status, type } = req.body;

  if (!email || !firstName || !lastName || !password || !status || !type) {
    throw new BadRequest("Please provide all the required fields");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let info = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
    status: status,
    type: type,
  };

  const user = await User.create(info);

  const accessToken = jwt.sign(
    { id: user.id, type: user.type },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
  res.status(201).json({ accessToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Please provide all the required fields");
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const accessToken = jwt.sign(
      { id: user.id, type: user.type },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(StatusCodes.OK).json({ accessToken });
  } else {
    throw new Unauthenticated("Invalid password");
  }
};

module.exports = {
  signUp,
  login,
};
