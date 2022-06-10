const { StatusCodes } = require("http-status-codes");
const db = require("../db/connection");
const { Op } = require("sequelize");
const { Unauthenticated, BadRequest } = require("../errors");

const PublicListing = db.publicListings;
const Image = db.images;
const Spot = db.spots;

const getAllListings = async (req, res) => {
  const listings = await PublicListing.findAll({
    where: { status: "active" },
    include: [
      {
        model: Image,
        as: "images",
      },
    ],
  });
  listings.forEach((listing) => {
    listing.setDataValue(
      "imageUrls",
      listing.images.map((imageObject) => {
        return imageObject.imageUrl;
      })
    );
  });

  res.status(StatusCodes.OK).json(listings);
};

const searchListings = async (req, res) => {
  const { search } = req.params;

  const listings = await PublicListing.findAll({
    where: {
      status: "active",
      name: {
        [Op.like]: "%" + search + "%",
      },
    },
    include: [
      {
        model: Image,
        as: "images",
      },
    ],
  });
  listings.forEach((listing) => {
    listing.setDataValue(
      "imageUrls",
      listing.images.map((imageObject) => {
        return imageObject.imageUrl;
      })
    );
  });
  res.status(StatusCodes.OK).json(listings);
};

const createPublicListing = async (req, res) => {
  const user = req.user;
  if (user.type !== "owner") {
    throw new Unauthenticated("Your account is not an owner account");
  }
  const {
    name,
    shortDescription,
    detailedDescription,
    type,
    images,
    spots,
    parentId,
  } = req.body;

  if (
    !name ||
    !shortDescription ||
    !detailedDescription ||
    !type ||
    !images ||
    !spots
  ) {
    throw new BadRequest("Please provide all the fields");
  }

  const t = await db.sequelize.transaction();

  const newListing = {
    ownerId: user.id,
    name: name,
    shortDescription: shortDescription,
    detailedDescription: detailedDescription,
    type: type,
    parentId: typeof parentId === "undefined" ? null : parentId,
  };

  try {
    const listing = await PublicListing.create(newListing, { transaction: t });

    const imageObjects = images.map((imageUrl) => {
      return {
        listingId: listing.id,
        imageUrl,
      };
    });
    await Image.bulkCreate(imageObjects, { transaction: t });

    const spotObjects = spots.map((spot) => {
      return {
        listingId: listing.id,
        availableSpots: spot.availableSpots,
        rowName: spot.rowName,
      };
    });
    console.log(spotObjects);
    await Spot.bulkCreate(spotObjects, { transaction: t });
    await t.commit();
    res.status(StatusCodes.CREATED).json({ id: listing.id });
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new BadRequest("Something went wrong while executing transaction");
  }
};

const getListingDetails = async (req, res) => {
  const { id } = req.params;
  const listing = await PublicListing.findOne({
    where: { id: id },
    include: [
      {
        model: Image,
        as: "images",
        attributes: ["imageUrl"],
      },
      {
        model: Spot,
        as: "spots",
      },
    ],
  });
  listing.setDataValue(
    "imageUrls",
    listing.images.map((imageObject) => {
      return imageObject.imageUrl;
    })
  );
  res.status(StatusCodes.OK).json(listing);
};

module.exports = {
  getAllListings,
  searchListings,
  createPublicListing,
  getListingDetails,
};
