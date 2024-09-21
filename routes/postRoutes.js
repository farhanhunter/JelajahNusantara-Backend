const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { body } = require("express-validator");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         imageUrl:
 *           type: string
 *           description: The URL of the image associated with the post
 *         cloudinaryId:
 *           type: string
 *           description: The Cloudinary ID of the image
 *         userId:
 *           type: integer
 *           description: The ID of the user who created the post
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the post was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the post was last updated
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               cloudinaryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */
router.post(
  "/",
  authMiddleware,
  validate([
    body("content").notEmpty(),
    body("imageUrl").optional().isURL(),
    body("cloudinaryId").optional().isString(),
  ]),
  postController.createPost
);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Returns the list of all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", postController.getPosts);

/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The post id
 *     responses:
 *       201:
 *         description: The post was successfully liked
 *       400:
 *         description: The post was already liked
 *       500:
 *         description: Some server error
 */
router.post(
  "/:postId/like",
  authMiddleware,
  validate([body("postId").isInt()]),
  postController.likePost
);

/**
 * @swagger
 * /posts/{postId}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post was successfully unliked
 *       400:
 *         description: The post was not liked
 *       500:
 *         description: Some server error
 */
router.delete(
  "/:postId/like",
  authMiddleware,
  validate([body("postId").isInt()]),
  postController.unlikePost
);

module.exports = router;
