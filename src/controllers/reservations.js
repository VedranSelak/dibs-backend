const { StatusCodes } = require("http-status-codes");
const db = require("../db/connection");
const { Op } = require("sequelize");
const { Unauthenticated, BadRequest } = require("../errors");

const PublicListing = db.publicListings;
const Reservation = db.reservations;
const Spot = db.spots;

const createReservation = async (req, res) => {
  const {
    listingId,
    isPrivate,
    arrivalTime,
    stayApprox,
    numberOfParticipants,
  } = req.body;

  const { id } = req.user;

  if (
    !listingId ||
    typeof isPrivate === "undefined" ||
    isPrivate == null ||
    !arrivalTime ||
    !stayApprox ||
    !numberOfParticipants
  ) {
    throw new BadRequest("Please provide all the required fields");
  }

  const listing = await PublicListing.findOne({
    where: { id: listingId },
    include: [
      {
        model: Spot,
        as: "spots",
        separate: true,
        order: [["availableSpots", "asc"]],
      },
      {
        model: Reservation,
        as: "reservations",
        separate: true,
        where: {
          [Op.or]: [
            {
              arrivalTimestamp: {
                [Op.gte]: arrivalTime,
                [Op.lt]: stayApprox,
              },
            },
            {
              stayApprox: {
                [Op.gt]: arrivalTime,
                [Op.lte]: stayApprox,
              },
            },
            {
              [Op.and]: [
                {
                  arrivalTimestamp: {
                    [Op.lte]: arrivalTime,
                  },
                },
                {
                  stayApprox: {
                    [Op.gte]: stayApprox,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                {
                  arrivalTimestamp: {
                    [Op.gte]: arrivalTime,
                  },
                },
                {
                  stayApprox: {
                    [Op.lte]: stayApprox,
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  });

  const compatibileSpots = [];
  if (listing.type == "restaurant") {
    for (let spotIndex in listing.spots) {
      if (
        listing.spots[spotIndex].availableSpots - numberOfParticipants <= 2 &&
        listing.spots[spotIndex].availableSpots - numberOfParticipants >= 0
      ) {
        compatibileSpots.push(listing.spots[spotIndex]);
      }
    }
  } else if (listing.type == "sportcenter") {
    for (let spotIndex in listing.spots) {
      if (
        listing.spots[spotIndex].availableSpots - numberOfParticipants <= 2 &&
        listing.spots[spotIndex].availableSpots - numberOfParticipants >= -2
      ) {
        compatibileSpots.push(listing.spots[spotIndex]);
      }
    }
  }

  if (compatibileSpots.length <= 0) {
    throw new BadRequest("There is no compatible spot for your reservation");
  }

  const spots = [...compatibileSpots];
  for (let i = 0; i < spots.length; i++) {
    for (let resIndex in listing.reservations) {
      if (spots[i].id == listing.reservations[resIndex].spotId) {
        spots.splice(i, 1);
        i--;
        break;
      }
    }
  }

  if (spots.length <= 0) {
    throw new BadRequest("There is no compatible spot for your reservation");
  }

  const reservation = await Reservation.create({
    userId: id,
    listingId: listingId,
    spotId: spots[0].id,
    isPrivate: isPrivate,
    arrivalTimestamp: arrivalTime,
    stayApprox: stayApprox,
    numOfParticipants: numberOfParticipants,
  });

  res.status(StatusCodes.CREATED).json({ id: reservation.id });
};

module.exports = {
  createReservation,
};
