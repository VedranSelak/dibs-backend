const { Unauthenticated } = require("../errors");
const jwt = require("jsonwebtoken");

const authorizationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Unauthenticated("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { id, type } = decoded;
    req.user = { id, type };
    next();
  } catch (error) {
    throw new Unauthenticated("Not authorized to access this route");
  }
};

module.exports = authorizationMiddleware;
