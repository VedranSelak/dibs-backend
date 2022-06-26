const { StatusCodes } = require("http-status-codes");
const db = require("../db/connection");
const { Op } = require("sequelize");
const { BadRequest, Unauthenticated } = require("../errors");
const { Sequelize, sequelize } = require("../db/connection");
const Forbidden = require("../errors/forbidden");

const PublicListing = db.publicListings;
const Reservation = db.reservations;
const Spot = db.spots;
const Image = db.images;
const Room = db.rooms;
const User = db.users;

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
  } else if (listing.type == "club") {
    for (let spotIndex in listing.spots) {
      if (
        listing.spots[spotIndex].availableSpots - numberOfParticipants <= 2 &&
        listing.spots[spotIndex].availableSpots - numberOfParticipants >= 0
      ) {
        compatibileSpots.push(listing.spots[spotIndex]);
      }
    }
  } else if (listing.type == "bar") {
    for (let spotIndex in listing.spots) {
      if (
        listing.spots[spotIndex].availableSpots - numberOfParticipants <= 2 &&
        listing.spots[spotIndex].availableSpots - numberOfParticipants >= 0
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

const getUpcomingReservations = async (req, res) => {
  const reservations = await Reservation.findAll({
    where: {
      userId: req.user.id,
      isPrivate: false,
      arrivalTimestamp: {
        [Op.gt]: Date.now(),
      },
    },
    include: {
      model: PublicListing,
      as: "publicListing",
      include: {
        model: Image,
        as: "images",
      },
    },
    order: [["arrivalTimestamp", "asc"]],
    attributes: [
      "id",
      "roomId",
      "listingId",
      "spotId",
      "isPrivate",
      "arrivalTimestamp",
      "stayApprox",
      "numOfParticipants",
    ],
  }).then((data) => {
    data.forEach((reservation) => {
      reservation.setDataValue("place", reservation.publicListing);
    });
    return data;
  });

  const roomReservations = await Reservation.findAll({
    where: {
      userId: req.user.id,
      isPrivate: true,
      arrivalTimestamp: {
        [Op.gt]: Date.now(),
      },
    },
    attributes: [
      "id",
      "roomId",
      "listingId",
      "spotId",
      "isPrivate",
      "arrivalTimestamp",
      "stayApprox",
      "numOfParticipants",
    ],
    include: {
      model: Room,
      as: "room",
    },
    order: [["arrivalTimestamp", "asc"]],
  }).then((data) => {
    data.forEach((reservation) => {
      reservation.setDataValue("place", reservation.room);
    });
    return data;
  });

  reservations.forEach((reservation) => {
    reservation.publicListing.setDataValue(
      "imageUrl",
      reservation.publicListing.images[0].imageUrl
    );
  });

  const result = [...reservations, ...roomReservations];
  result.sort((a, b) => {
    return a.arrivalTimestamp - b.arrivalTimestamp;
  });

  res.status(StatusCodes.OK).json(result);
};

const getRecentReservations = async (req, res) => {
  const millisecondsInMonth = 2629800000;
  const reservations = await Reservation.findAll({
    where: {
      userId: req.user.id,
      isPrivate: false,
      inHistory: true,
      arrivalTimestamp: {
        [Op.gt]: Date.now() - millisecondsInMonth,
        [Op.lt]: Date.now(),
      },
    },
    include: {
      model: PublicListing,
      as: "publicListing",
      include: {
        model: Image,
        as: "images",
      },
    },
    attributes: [
      "id",
      "roomId",
      "listingId",
      "spotId",
      "isPrivate",
      "arrivalTimestamp",
      "stayApprox",
      "numOfParticipants",
    ],
    order: [["arrivalTimestamp", "desc"]],
  }).then((data) => {
    data.forEach((reservation) => {
      reservation.setDataValue("place", reservation.publicListing);
    });
    return data;
  });

  const roomReservations = await Reservation.findAll({
    where: {
      userId: req.user.id,
      isPrivate: true,
      inHistory: true,
      arrivalTimestamp: {
        [Op.gt]: Date.now() - millisecondsInMonth,
        [Op.lt]: Date.now(),
      },
    },
    include: {
      model: Room,
      as: "room",
    },
    attributes: [
      "id",
      "roomId",
      "listingId",
      "spotId",
      "isPrivate",
      "arrivalTimestamp",
      "stayApprox",
      "numOfParticipants",
    ],
    order: [["arrivalTimestamp", "desc"]],
  }).then((data) => {
    data.forEach((reservation) => {
      reservation.setDataValue("place", reservation.room);
    });
    return data;
  });

  reservations.forEach((reservation) => {
    reservation.publicListing.setDataValue(
      "imageUrl",
      reservation.publicListing.images[0].imageUrl
    );
  });

  const result = [...reservations, ...roomReservations];
  result.sort((a, b) => {
    return b.arrivalTimestamp - a.arrivalTimestamp;
  });

  res.status(StatusCodes.OK).json(result);
};

const createRoomReservation = async (req, res) => {
  const { roomId, arrivalTime, stayApprox } = req.body;

  const { id } = req.user;

  if (!roomId || !arrivalTime || !stayApprox) {
    throw new BadRequest("Please provide all the required fields");
  }
  const room = await Room.findOne({
    where: { id: roomId },
    include: [
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

  if (room.reservations.length == room.capacity) {
    throw new BadRequest(
      "There is no more available spots in your time slot",
      400
    );
  }

  const reservation = await Reservation.create({
    userId: id,
    roomId: roomId,
    isPrivate: true,
    arrivalTimestamp: arrivalTime,
    stayApprox: stayApprox,
    numOfParticipants: 1,
  });

  res.status(StatusCodes.CREATED).json({ id: reservation.id });
};

const getRecentListingReservations = async (req, res) => {
  const millisecondsInMonth = 2629800000;
  const { id, type } = req.user;

  if (type !== "owner") {
    throw new Forbidden("You are no allowed to access this route");
  }

  const listing = await PublicListing.findOne({
    where: {
      ownerId: id,
    },
    attributes: ["id"],
  });

  if (!listing.id) {
    throw new BadRequest("Please create a listing first");
  }

  const reservations = await Reservation.findAll({
    where: {
      listingId: listing.id,
      arrivalTimestamp: {
        [Op.gt]: Date.now() - millisecondsInMonth,
        [Op.lt]: Date.now(),
      },
    },
    include: {
      model: User,
      as: "user",
      attributes: ["id", "firstName", "lastName", "imageUrl"],
    },
    attributes: [
      "id",
      "spotId",
      "arrivalTimestamp",
      "stayApprox",
      "numOfParticipants",
    ],
    order: [["arrivalTimestamp", "desc"]],
  });

  res.status(StatusCodes.OK).json(reservations);
};

const getUpcomingListingReservations = async (req, res) => {
  const { id, type } = req.user;

  if (type !== "owner") {
    throw new Forbidden("You are no allowed to access this route");
  }

  const listing = await PublicListing.findOne({
    where: {
      ownerId: id,
    },
    attributes: ["id"],
  });

  if (!listing.id) {
    throw new BadRequest("Please create a listing first");
  }

  const reservations = await Reservation.findAll({
    where: {
      listingId: listing.id,
      arrivalTimestamp: {
        [Op.gt]: Date.now(),
      },
    },
    include: {
      model: User,
      as: "user",
      attributes: ["id", "firstName", "lastName", "imageUrl"],
    },
    attributes: [
      "id",
      "spotId",
      "arrivalTimestamp",
      "stayApprox",
      "numOfParticipants",
    ],
    order: [["arrivalTimestamp", "asc"]],
  });

  res.status(StatusCodes.OK).json(reservations);
};

const cancelReservation = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  const reservation = await Reservation.findOne({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!reservation.id) {
    throw new BadRequest("This reservation does not exit");
  }

  if (reservation.arrivalTimestamp - Date.now() < 3600000 * 3) {
    throw new BadRequest("It is to late to cancel the reservation");
  }

  await Reservation.destroy({
    where: {
      id: id,
    },
  });

  res.status(StatusCodes.CREATED).json({ id: reservation.id });
};

const removeFromHistory = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  await Reservation.update(
    {
      inHistory: false,
    },
    {
      where: {
        id: id,
        userId: userId,
      },
    }
  );

  res.status(StatusCodes.CREATED).json({ id: parseInt(id) });
};

module.exports = {
  createReservation,
  getUpcomingReservations,
  getRecentReservations,
  createRoomReservation,
  getRecentListingReservations,
  getUpcomingListingReservations,
  cancelReservation,
  removeFromHistory,
};
