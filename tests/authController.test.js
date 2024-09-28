// authController.test.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User } = require("../models"); // Pastikan path ini benar
const authController = require("../controllers/authController"); // Pastikan path ini benar

// Mock untuk response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Fungsi helper untuk membersihkan database
async function clearDatabase() {
  await User.destroy({ where: {} });
}

beforeAll(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
});

describe("Login", () => {
  beforeEach(async () => {
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
      isEmailConfirmed: true,
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should login successfully with valid credentials", async () => {
    const req = {
      body: {
        email: "testuser@example.com",
        password: "password123",
      },
    };
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  it("should return 401 for invalid credentials", async () => {
    const req = {
      body: {
        email: "testuser@example.com",
        password: "wrongpassword",
      },
    };
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid credentials",
      })
    );
  });

  it("should return 400 for missing fields", async () => {
    const req = {
      body: {
        email: "testuser@example.com",
      },
    };
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
      })
    );
  });
});

describe("Confirm Email", () => {
  it("should confirm email successfully with valid token", async () => {
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      confirmationToken: "validtoken",
      confirmationTokenExpires: Date.now() + 3600000, // 1 hour from now
    });

    const req = {
      body: {
        token: "validtoken",
      },
    };
    const res = mockResponse();

    await authController.confirmEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Email confirmed successfully",
      })
    );

    const updatedUser = await User.findByPk(user.id);
    expect(updatedUser.isEmailConfirmed).toBe(true);
    expect(updatedUser.confirmationToken).toBeNull();
    expect(updatedUser.confirmationTokenExpires).toBeNull();
  });
});

describe("Forgot Password", () => {
  beforeEach(async () => {
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
      isEmailConfirmed: true,
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should send reset password email for valid user", async () => {
    const req = {
      body: {
        email: "testuser@example.com",
      },
    };
    const res = mockResponse();

    await authController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Reset token sent to email",
      })
    );

    const user = await User.findOne({
      where: { email: "testuser@example.com" },
    });
    expect(user.resetPasswordToken).toBeTruthy();
    expect(user.resetPasswordExpires).toBeTruthy();
  });

  it("should return 404 for non-existent user", async () => {
    const req = {
      body: {
        email: "nonexistent@example.com",
      },
    };
    const res = mockResponse();

    await authController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User not found",
      })
    );
  });
});

describe("Reset Password", () => {
  let resetToken;
  let hashedToken;

  beforeEach(async () => {
    resetToken = crypto.randomBytes(20).toString("hex");
    hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await User.create({
      username: "resetuser",
      email: "resetuser@example.com",
      password: await bcrypt.hash("oldpassword", 10),
      isEmailConfirmed: true,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 3600000,
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should reset password with valid token", async () => {
    const req = {
      params: { resettoken: resetToken },
      body: { password: "newpassword123" },
    };
    const res = mockResponse();

    await authController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Password reset successful",
      })
    );

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
    const req = {
      params: { resettoken: "invalidtoken" },
      body: { password: "newpassword123" },
    };
    const res = mockResponse();

    await authController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid or expired token",
      })
    );
  });
});
