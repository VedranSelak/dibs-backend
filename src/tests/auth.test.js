const request = require("supertest");
const app = require("../../app");
const db = require("../db/connection");

const User = db.users;

describe("Test Auth", () => {
  beforeAll(async () => {
    await User.create({
      firstName: "Vedran",
      lastName: "Selak",
      email: "selakvedran@gmail.com",
      password: "$2a$10$qlU5HiZv3Xth8luRs7bRFumlTxaPGAqZMm69A/UOWLhFbd5v89UQG",
      type: "owner",
      imageUrl:
        "https://res.cloudinary.com/dibsapp/image/upload/v1655122643/fhjuxz3hzqsjyp6jsg6w.jpg",
    });
  });

  afterAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Test login unsuccessful", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "selakvedran@gmail.com",
        password: "password1",
      })
      .expect(401);
  });

  test("Test login successful", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "selakvedran@gmail.com",
        password: "password",
      })
      .expect(200);
  });

  test("Test login bad request", async () => {
    await request(app)
      .post("/api/v1/login")
      .send({
        email: "selakvedran@gmail.com",
      })
      .expect(400);
  });

  test("Test signup successful", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "password",
        type: "user",
      })
      .expect(201);
  });

  test("Test signup unsuccessful", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "password",
        type: "user",
      })
      .expect(500);
  });

  test("Test signup bad request", async () => {
    await request(app)
      .post("/api/v1/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(400);
  });
});
