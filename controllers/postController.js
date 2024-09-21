const { Post, User, Like } = require("../models");
const jwt = require("jsonwebtoken");

const postController = {
  async createPost(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { content, imageUrl, cloudinaryId } = req.body;
      const post = await Post.create({
        content,
        imageUrl,
        cloudinaryId,
        userId,
      });

      res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({ message: "Could not create post" });
    }
  },

  async likePost(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { postId } = req.params;

      const [like, created] = await Like.findOrCreate({
        where: { userId, postId },
      });

      if (created) {
        await Post.increment("likeCount", { where: { id: postId } });
        res.status(201).json({ message: "Post liked successfully" });
      } else {
        res.status(400).json({ message: "You've already liked this post" });
      }
    } catch (error) {
      console.error("Like post error:", error);
      res.status(500).json({ message: "Could not like post" });
    }
  },

  async unlikePost(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { postId } = req.params;

      const deleted = await Like.destroy({
        where: { userId, postId },
      });

      if (deleted) {
        await Post.decrement("likeCount", { where: { id: postId } });
        res.status(200).json({ message: "Post unliked successfully" });
      } else {
        res.status(400).json({ message: "You haven't liked this post" });
      }
    } catch (error) {
      console.error("Unlike post error:", error);
      res.status(500).json({ message: "Could not unlike post" });
    }
  },

  async getPosts(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "username"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ message: "Could not fetch posts" });
    }
  },
};

module.exports = postController;
