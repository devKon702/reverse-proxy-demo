const User = require("../models/User");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      const usersWithoutPassword = users.map(
        ({ _doc: { password, ...otherInfor } }) => otherInfor
      );
      res.status(200).json(usersWithoutPassword);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
