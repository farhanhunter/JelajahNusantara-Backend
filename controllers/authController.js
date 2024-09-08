const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User } = require("../models");
const { Op } = require("sequelize");
const sendEmail = require("../utils/sendEmail");

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  },

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate confirmation token
      const confirmationToken = crypto.randomBytes(20).toString("hex");

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        confirmationToken,
        isEmailConfirmed: false,
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Create confirmation URL
      const confirmationUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/confirm-email/${confirmationToken}`;

      // Send confirmation email
      await sendEmail({
        email: user.email,
        subject: "Please confirm your email",
        message: `Thank you for registering. Please confirm your email by clicking on the following link: \n\n ${confirmationUrl}`,
      });

      res.status(201).json({
        message:
          "User registered successfully. Please check your email to confirm your account.",
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ message: "Email or username already exists" });
      }
      res
        .status(400)
        .json({ message: "An error occurred during registration" });
    }
  },

  async confirmEmail(req, res) {
    try {
      const { token } = req.body; // Menggunakan req.body alih-alih req.params

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      const user = await User.findOne({ where: { confirmationToken: token } });

      if (!user) {
        return res.status(400).json({ message: "Invalid confirmation token" });
      }

      if (user.isEmailConfirmed) {
        return res.status(400).json({ message: "Email already confirmed" });
      }

      user.isEmailConfirmed = true;
      user.confirmationToken = null;
      await user.save();

      res.status(200).json({ message: "Email confirmed successfully" });
    } catch (error) {
      console.error("Email confirmation error:", error);
      res
        .status(500)
        .json({ message: "Could not confirm email", error: error.message });
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    let user;

    try {
      user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/resetpassword/${resetToken}`;

      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`,
      });

      res.status(200).json({ message: "Reset token sent to email" });
    } catch (error) {
      console.error("Forgot password error:", error);

      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user
          .save()
          .catch((saveError) =>
            console.error("Error clearing reset token:", saveError)
          );
      }

      res
        .status(500)
        .json({ message: "Could not process password reset request" });
    }
  },

  async resetPassword(req, res) {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");

      const user = await User.findOne({
        where: {
          resetPasswordToken,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Could not reset password" });
    }
  },
};

module.exports = authController;
