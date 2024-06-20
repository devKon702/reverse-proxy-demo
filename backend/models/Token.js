const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      minlength: 5,
      maxlength: 20,
      unique: true,
    },
    token: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
