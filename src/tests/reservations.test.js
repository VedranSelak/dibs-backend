const request = require("supertest");
const app = require("../../app");
const db = require("../db/connection");

const PublicListing = db.publicListings;
const User = db.users;
const Spot = db.spots;
const Image = db.images;

const user1 = {
  firstName: "Jane",
  lastName: "Doe",
  email: "janedoe@gmail.com",
  password: "$2a$10$qlU5HiZv3Xth8luRs7bRFumlTxaPGAqZMm69A/UOWLhFbd5v89UQG",
  type: "owner",
  imageUrl:
    "https://res.cloudinary.com/dibsapp/image/upload/v1655122643/fhjuxz3hzqsjyp6jsg6w.jpg",
};

describe("Test Reservations", () => {
  let listing;
  let tokenRes;
  beforeAll(async () => {
    const user = await User.create(user1);
    listing = await PublicListing.create({
      ownerId: user.id,
      name: "Sara club",
      shortDescription: "Sara club is an amazing club",
      detailedDescription:
        "An amazing club with the best performers performing every week. Great isolation and speakers provide the best musical environment. Make a reservation and enjoj the night.",
      type: "club",
      parentId: null,
    });
    await Spot.create({
      listingId: listing.id,
      availableSpots: 2,
    });
    await Image.create({
      listingId: listing.id,
      imageUrl:
        "https://res.cloudinary.com/dibsapp/image/upload/v1655126666/hfrxpdbzwmumflmhdgs0.jpg",
    });
    tokenRes = await request(app).post("/api/v1/login").send({
      email: "janedoe@gmail.com",
      password: "password",
    });
  });

  afterAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Test create reservation successful", async () => {
    const res = await request(app)
      .post("/api/v1/reservations")
      .set("Authorization", `Bearer ${tokenRes.body.accessToken}`)
      .send({
        listingId: listing.id,
        isPrivate: false,
        arrivalTime: 1660243316000,
        stayApprox: 1660250516000,
        numberOfParticipants: 2,
      });
    expect(res.status).toBe(201);
  });

  test("Test create reservation unsuccessful (no available spots)", async () => {
    const res = await request(app)
      .post("/api/v1/reservations")
      .set("Authorization", `Bearer ${tokenRes.body.accessToken}`)
      .send({
        listingId: listing.id,
        isPrivate: false,
        arrivalTime: 1660243316000,
        stayApprox: 1660250516000,
        numberOfParticipants: 2,
      });
    expect(res.status).toBe(400);
  });

  test("Test create reservation unauthorized", async () => {
    const res = await request(app).post("/api/v1/reservations").send({
      listingId: listing.id,
      isPrivate: false,
      arrivalTime: 1660243316000,
      stayApprox: 1660250516000,
      numberOfParticipants: 2,
    });
    expect(res.status).toBe(401);
  });

  test("Test retrieve upcoming reservations", async () => {
    const res = await request(app)
      .get("/api/v1/reservations/upcoming")
      .set("Authorization", `Bearer ${tokenRes.body.accessToken}`);
    expect(res.body.length).toBe(1);
    expect(res.status).toBe(200);
  });

  test("Test cancel reservation", async () => {
    const resBefore = await request(app)
      .get("/api/v1/reservations/upcoming")
      .set("Authorization", `Bearer ${tokenRes.body.accessToken}`);
    const cancelRes = await request(app)
      .delete(`/api/v1/reservations/cancel/${resBefore.body[0].id}`)
      .set("Authorization", `Bearer ${tokenRes.body.accessToken}`);
    const resAfter = await request(app)
      .get("/api/v1/reservations/upcoming")
      .set("Authorization", `Bearer ${tokenRes.body.accessToken}`);
    expect(cancelRes.status).toBe(201);
    expect(resAfter.body.length).toBe(0);
  });
});
