const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController"); // Import authController
const { body, validationResult } = require("express-validator");

// Middleware untuk validasi input
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// Rute untuk operasi CRUD pengguna
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Rute untuk registrasi pengguna
router.post(
  "/auth/register",
  validate([
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
    body("profilePicture")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL"),
  ]),
  authController.register // Menggunakan fungsi register dari authController
);

// Rute untuk login pengguna
router.post(
  "/auth/login",
  validate([
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  authController.login // Menggunakan fungsi login dari authController
);

module.exports = router;
