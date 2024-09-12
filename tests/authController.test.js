// authController.test.js
const request = require("supertest");
const app = require("../app"); // Adjust the path to your app.js
const { User } = require("../models"); // Adjust the path to your User model
const bcrypt = require("bcrypt");

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    // Create a test user in the database
    await User.create({
      username: "faCopy3",
      email: "farhan3@yopmail.com",
      password: await bcrypt.hash("password123", 10), // Hash the password
    });
  });

  afterAll(async () => {
    // Clean up the test user from the database
    await User.destroy({ where: { email: "farhan3@yopmail.com" } });
  });

  it("should login successfully with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "farhan3@yopmail.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "farhan3@yopmail.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should return 400 for missing fields", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "farhan3@yopmail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
