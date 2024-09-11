const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/userValidation");
const { validate } = require("../middleware/validateMiddleware");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Mendapatkan semua pengguna
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Daftar semua pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Kesalahan server
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Mendapatkan pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Detail pengguna
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Memperbarui pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password baru (opsional)
 *               profilePicture:
 *                 type: string
 *                 description: URL gambar profil (opsional)
 *     responses:
 *       200:
 *         description: Pengguna diperbarui
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.put("/:id", userController.updateUser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Menghapus pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Pengguna dihapus
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password pengguna
 *     responses:
 *       201:
 *         description: Pengguna berhasil didaftarkan
 *       400:
 *         description: Email atau username sudah digunakan
 */
router.post(
  "/auth/register",
  validate(registerValidation),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 description: Password pengguna
 *     responses:
 *       200:
 *         description: Berhasil login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Token
 *       401:
 *         description: Kredensial tidak valid
 */
router.post("/auth/login", validate(loginValidation), authController.login);

/**
 * @swagger
 * /auth/confirm-email/{token}:
 *   post:
 *     summary: Konfirmasi email dengan token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token konfirmasi email
 *     responses:
 *       200:
 *         description: Email berhasil dikonfirmasi
 *       400:
 *         description: Token tidak valid
 */
router.get("/auth/confirm-email/:token", authController.confirmEmail);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Meminta reset password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Alamat email pengguna
 *     responses:
 *       200:
 *         description: Instruksi reset password dikirim ke email
 *       404:
 *         description: Email tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
router.post(
  "/auth/forgot-password",
  validate(forgotPasswordValidation),
  authController.forgotPassword
);

/**
 * @swagger
 * /auth/reset-password/{resettoken}:
 *   put:
 *     summary: Reset password menggunakan token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Token reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Password baru pengguna
 *     responses:
 *       200:
 *         description: Password berhasil direset
 *       400:
 *         description: Token tidak valid atau expired
 */
router.put(
  "/auth/reset-password/:resettoken",
  validate(resetPasswordValidation),
  authController.resetPassword
);

/**
 * @swagger
 * /auth/reset-password/{resettoken}:
 *   put:
 *     summary: Reset password menggunakan token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Token untuk reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil direset
 *       400:
 *         description: Token tidak valid atau expired
 */
router.put(
  "/auth/reset-password/:resettoken",
  validate(resetPasswordValidation),
  authController.resetPassword
);

module.exports = router;
