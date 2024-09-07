const { User } = require("../models");
const bcrypt = require("bcrypt");

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // async createUser(req, res) {
  //   try {
  //     const { username, email, password, profilePicture } = req.body;

  //     // Hash the password
  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     // Generate confirmation token (you may want to use a library like crypto for this)
  //     const confirmationToken = Math.random().toString(36).substring(2, 15);

  //     const user = await User.create({
  //       username,
  //       email,
  //       password: hashedPassword,
  //       profilePicture,
  //       isEmailConfirmed: false,
  //       confirmationToken,
  //     });

  //     // Here you would typically send a confirmation email with the confirmationToken

  //     res.status(201).json({
  //       message: "User created successfully",
  //       user: {
  //         id: user.id,
  //         username: user.username,
  //         email: user.email,
  //         profilePicture: user.profilePicture,
  //         isEmailConfirmed: user.isEmailConfirmed,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },

  async updateUser(req, res) {
    try {
      const { password, ...otherFields } = req.body;
      let updateFields = { ...otherFields };

      if (password) {
        // Hash the new password if it is being updated
        updateFields.password = await bcrypt.hash(password, 10);
      }

      const [updated] = await User.update(updateFields, {
        where: { id: req.params.id },
      });

      if (updated) {
        const updatedUser = await User.findByPk(req.params.id);
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
