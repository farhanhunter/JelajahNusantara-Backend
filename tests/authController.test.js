// authController.test.js
const request = require("supertest");
const app = require("../app"); // Adjust the path to your app.js
const { User } = require("../models"); // Adjust the path to your User model
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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

describe("POST /api/auth/forgot-password", () => {
  beforeEach(async () => {
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
    });
  });

  afterEach(async () => {
    await User.destroy({ where: { email: "testuser@example.com" } });
  });

  it("should send reset password email for valid user", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "testuser@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Reset token sent to email"
    );

    // Verifikasi bahwa token reset password telah di-set di database
    const user = await User.findOne({
      where: { email: "testuser@example.com" },
    });
    expect(user.resetPasswordToken).toBeTruthy();
    expect(user.resetPasswordExpires).toBeTruthy();
  });

  it("should return 404 for non-existent user", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});

describe("PUT /api/auth/reset-password/:resettoken", () => {
  let resetToken;
  let hashedToken;

  beforeEach(async () => {
    resetToken = crypto.randomBytes(20).toString("hex");
    hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await User.create({
      username: "resetuser",
      email: "resetuser@example.com",
      password: await bcrypt.hash("oldpassword", 10),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 3600000, // Token berlaku selama 1 jam
    });
  });

  afterEach(async () => {
    await User.destroy({ where: { email: "resetuser@example.com" } });
  });

  it("should reset password with valid token", async () => {
    const response = await request(app)
      .put(`/api/auth/reset-password/${resetToken}`)
      .send({ password: "newpassword123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Password reset successful"
    );

    // Verifikasi bahwa password telah diubah
    const user = await User.findOne({
      where: { email: "resetuser@example.com" },
    });
    const isNewPasswordValid = await bcrypt.compare(
      "newpassword123",
      user.password
    );
    expect(isNewPasswordValid).toBe(true);
    expect(user.resetPasswordToken).toBeNull();
    expect(user.resetPasswordExpires).toBeNull();
  });

  it("should return 400 for invalid or expired token", async () => {
    const response = await request(app)
      .put(`/api/auth/reset-password/invalidtoken`)
      .send({ password: "newpassword123" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });
});
