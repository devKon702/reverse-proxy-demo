const jwt = require("jsonwebtoken");
const tokenService = require("../services/tokenService");
const Token = require("../models/Token");

const verifyController = {
  verifyToken: async (req, res, next) => {
    try {
      accessToken = req.cookies.accessToken;

      if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, payload) => {
          if (!err) {
            req.user = {
              id: payload.id,
              username: payload.username,
              role: payload.role,
            };
            next();
          }
          // Access token quá hạn
          else if (err.name === "TokenExpiredError") {
            console.log("Access token expired");
            verifyController.doRefreshToken(req, res, next);
          }
          // Access token không hợp lệ
          else {
            res.status(401).json({ msg: "Access Token ís not valid" });
          }
        });
      } else {
        verifyController.doRefreshToken(req, res, next);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  doRefreshToken: async (req, res, next) => {
    try {
      refreshToken = req.cookies.refreshToken;
      // Có refresh token trong cookie
      if (refreshToken) {
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_KEY,
          async (err, payload) => {
            // Refresh token không hợp lệ
            if (err)
              return res
                .status(401)
                .json({ msg: "Refresh Token is not valid" });
            // Tìm kiếm và cập nhật token trong mongo
            const updatedRefreshToken = await Token.findOneAndUpdate(
              { username: payload.username, token: refreshToken },
              {
                token: tokenService.genRefreshToken({
                  id: payload.id,
                  username: payload.username,
                  role: payload.role,
                }),
              },
              { new: true }
            );
            // Tìm thấy và đã cập nhật
            if (updatedRefreshToken) {
              res.cookie(
                "accessToken",
                tokenService.genAccessToken({
                  id: payload.id,
                  username: payload.username,
                  role: payload.role,
                }),
                {
                  maxAge: tokenService.accessTokenExpires,
                  httpOnly: true,
                  secure: false,
                }
              );
              res.cookie("refreshToken", updatedRefreshToken.token, {
                maxAge: tokenService.refreshTokenExpires,
                httpOnly: true,
                secure: false,
              });
              req.user = {
                id: payload.id,
                username: payload.username,
                role: payload.role,
              };
              next();
            }
            // Không tìm thấy trong db
            else {
              res.status(401).json({ msg: "You're not authenticated" });
            }
          }
        );
      } else {
        res.status(401).json({ msg: "You're not authenticated" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  verifyCheckUserInfor: async (req, res, next) => {
    verifyController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.role == "admin") {
        next();
      } else {
        res.status(403).json({ msg: "You're not allowed to check this user" });
      }
    });
  },
};

module.exports = verifyController;
