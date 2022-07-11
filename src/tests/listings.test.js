const request = require("supertest");
const app = require("../../app");
const db = require("../db/connection");

const PublicListing = db.publicListings;
const User = db.users;

const user1 = {
  firstName: "Jane",
  lastName: "Doe",
  email: "janedoe@gmail.com",
  password: "$2a$10$qlU5HiZv3Xth8luRs7bRFumlTxaPGAqZMm69A/UOWLhFbd5v89UQG",
  type: "owner",
  imageUrl:
    "https://res.cloudinary.com/dibsapp/image/upload/v1655122643/fhjuxz3hzqsjyp6jsg6w.jpg",
};

describe("Test Listings", () => {
  beforeAll(async () => {
    const user = await User.create(user1);
    await PublicListing.bulkCreate([
      {
        ownerId: user.id,
        name: "Sara club",
        shortDescription: "Sara club is an amazing club",
        detailedDescription:
          "An amazing club with the best performers performing every week. Great isolation and speakers provide the best musical environment. Make a reservation and enjoj the night.",
        type: "club",
        parentId: null,
      },
      {
        ownerId: user.id,
        name: "Walter ego",
        shortDescription: "Pub and restaurant in Sarajevo, Center",
        detailedDescription:
          " We are a pub in te center of Sarajevo that besides amazing craft beer we have amazing food. Our beer is homemade bosnian beer with a twist. Create a reservation and have a great time.",
        type: "restaurant",
        parentId: null,
      },
    ]);
  });

  afterAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Test retrieving listings", async () => {
    const res = await request(app).get("/api/v1/listings");
    expect(res.body.length).toBe(2);
    expect(res.status).toBe(200);
  });

  test("Test filtering listings", async () => {
    const res = await request(app).get("/api/v1/listings?filters=club");
    expect(res.body.length).toBe(1);
  });

  test("Test search listings", async () => {
    const res = await request(app).get("/api/v1/listings/search/Sara");
    expect(res.body.length).toBe(1);
  });
});
