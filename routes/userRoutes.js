const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../validations/userValidation");
const { validate } = require("../middleware/validateMiddleware");

// Rute untuk operasi CRUD pengguna
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Rute untuk registrasi pengguna
router.post(
  "/auth/register",
  validate(registerValidation),
  authController.register
);

// Rute untuk login pengguna
router.post("auth/login", validate(loginValidation), authController.login);

router.post("/auth/confirm-email/:token", authController.confirmEmail);

module.exports = router;
