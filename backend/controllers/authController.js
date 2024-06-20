const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/Token");
const tokenService = require("../services/tokenService");

const AuthController = {
  // Register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new User
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(502).json(error);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json({ msg: "Wrong username" });
        return;
      }
      if (!(await bcrypt.compare(req.body.password, user.password))) {
        res.status(404).json({ msg: "Wrong password" });
        return;
      }
      // Login success
      const accessToken = tokenService.genAccessToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });
      const refreshToken = tokenService.genRefreshToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: tokenService.accessTokenExpires,
        httpOnly: true,
        secure: false,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: tokenService.refreshTokenExpires,
        httpOnly: true,
        secure: false,
      });

      // Save refresh token to mongo
      const updatedToken = await Token.findOneAndUpdate(
        { username: user.username },
        { token: refreshToken },
        { new: true }
      );
      if (!updatedToken) {
        const newToken = await new Token({
          username: user.username,
          token: refreshToken,
        });
        await newToken.save();
      }

      //   send user infor except password
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  logoutUser: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      await Token.deleteOne({ token: req.cookies.refreshToken });
      res.status(200).json({ msg: "Logged out!!!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = AuthController;
