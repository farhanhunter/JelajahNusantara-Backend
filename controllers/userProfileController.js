const { UserProfile, User } = require("../models");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");

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

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let profileData = { userId };

      if (profilePicture) {
        try {
          // Assuming profilePicture is the path to the file in the uploads folder
          const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            profilePicture
          );

          if (fs.existsSync(filePath)) {
            const result = await cloudinary.uploader.upload(filePath);
            profileData.profilePicture = result.secure_url;
            profileData.cloudinaryId = result.public_id;

            // Clean up the local file after upload
            fs.unlinkSync(filePath);
          } else {
            return res
              .status(404)
              .json({ message: "Profile picture file not found" });
          }
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }

      const profile = await UserProfile.create(profileData);
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
      const file = req.file;

      const profile = await UserProfile.findByPk(id);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      if (file) {
        try {
          if (profile.cloudinaryId) {
            await cloudinary.uploader.destroy(profile.cloudinaryId);
          }

          const result = await cloudinary.uploader.upload(file.path);
          profile.profilePicture = result.secure_url;
          profile.cloudinaryId = result.public_id;
        } catch (uploadError) {
          console.error("Error updating image on Cloudinary:", uploadError);
          return res.status(500).json({ message: "Error updating image" });
        } finally {
          // Clean up the local file
          fs.unlinkSync(file.path);
        }
      }

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

      if (profile.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(profile.cloudinaryId);
        } catch (deleteError) {
          console.error("Error deleting image from Cloudinary:", deleteError);
        }
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
