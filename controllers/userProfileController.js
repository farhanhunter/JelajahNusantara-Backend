const { UserProfile, User } = require("../models");

const userProfileController = {
  async getAllUserProfiles(req, res) {
    try {
      const profiles = await UserProfile.findAll({
        include: [{ model: User, as: "user" }],
      });
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching user profiles" });
    }
  },

  async getUserProfileById(req, res) {
    try {
      const { id } = req.params;
      const profile = await UserProfile.findOne({
        where: { id },
        include: [{ model: User, as: "user" }],
      });

      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching user profile" });
    }
  },

  async createUserProfile(req, res) {
    try {
      const { userId, profilePicture } = req.body;

      // Check if the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const profile = await UserProfile.create({ userId, profilePicture });
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating user profile:", error);
      res
        .status(500)
        .json({ message: "An error occurred while creating user profile" });
    }
  },

  async updateUserProfile(req, res) {
    try {
      const { id } = req.params;
      const { profilePicture } = req.body;

      const profile = await UserProfile.findByPk(id);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      profile.profilePicture = profilePicture;
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res
        .status(500)
        .json({ message: "An error occurred while updating user profile" });
    }
  },

  async deleteUserProfile(req, res) {
    try {
      const { id } = req.params;

      const profile = await UserProfile.findByPk(id);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      await profile.destroy();
      res.json({ message: "User profile deleted successfully" });
    } catch (error) {
      console.error("Error deleting user profile:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting user profile" });
    }
  },
};

module.exports = userProfileController;
