const { StatusCodes } = require("http-status-codes");
const db = require("../db/connection");
const { Unauthenticated, BadRequest } = require("../errors");

const PublicListing = db.publicListings;
const Image = db.images;
const Spot = db.spots;

const createReservation = async (req, res) => {
  const {
    listingId,
    isPrivate,
    arrivalTimestamp,
    stayApprox,
    numberOfParticipants,
  } = req.body;

  if (
    !listingId ||
    !isPrivate ||
    !arrivalTimestamp ||
    !stayApprox ||
    !numberOfParticipants
  ) {
    throw new BadRequest("Please provide all the required fields");
  }

  res.status(StatusCodes.OK).json({ msg: "Created" });
};

module.exports = {
  createReservation,
};
