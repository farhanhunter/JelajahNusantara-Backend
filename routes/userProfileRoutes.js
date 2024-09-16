const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all user profiles
 *     tags: [UserProfiles]
 *     responses:
 *       200:
 *         description: List of all user profiles
 */
router.get("/", userProfileController.getAllUserProfiles);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [UserProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User profile ID
 *     responses:
 *       200:
 *         description: User profile details
 *       404:
 *         description: User profile not found
 */
router.get("/:id", userProfileController.getUserProfileById);

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new user profile
 *     tags: [UserProfiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User ID
 *               profilePicture:
 *                 type: string
 *                 description: URL of the profile picture
 *     responses:
 *       201:
 *         description: User profile created
 *       404:
 *         description: User not found
 */
router.post(
  "/",
  upload.single("profilePicture"),
  userProfileController.createUserProfile
);

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [UserProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 description: URL of the profile picture
 *     responses:
 *       200:
 *         description: User profile updated
 *       404:
 *         description: User profile not found
 */
router.put(
  "/:id",
  upload.single("profilePicture"),
  userProfileController.updateUserProfile
);

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Delete user profile by ID
 *     tags: [UserProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User profile ID
 *     responses:
 *       200:
 *         description: User profile deleted
 *       404:
 *         description: User profile not found
 */
router.delete("/:id", userProfileController.deleteUserProfile);

module.exports = router;
