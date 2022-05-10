const { StatusCodes } = require("http-status-codes");
const db = require("../db/connection");
const { Unauthenticated, BadRequest } = require("../errors");

const PublicListing = db.publicListings;

const getAllListings = async (req, res) => {
  const listings = await PublicListing.findAll({});
  res.status(StatusCodes.OK).json({ listings });
};

const createPublicListing = async (req, res) => {
  const user = req.user;
  if (user.type !== "owner") {
    throw new Unauthenticated("Your account is not an owner account");
  }
  const { name, shortDescription, detailedDescription, type, parentId } =
    req.body;

  if (!name || !shortDescription || !detailedDescription || !type) {
    throw new BadRequest("Please provide all the fields");
  }

  const newListing = {
    ownerId: user.id,
    name: name,
    shortDescription: shortDescription,
    detailedDescription: detailedDescription,
    type: type,
    parentId: typeof parentId === "undefined" ? null : parentId,
  };

  console.log(newListing);
  const listing = await PublicListing.create(newListing);
  res.status(StatusCodes.CREATED).json({ id: listing.id });
};

module.exports = {
  getAllListings,
  createPublicListing,
};
