const jwt = require("jsonwebtoken");

const tokenService = {
  accessTokenExpires: 30 * 1000,
  refreshTokenExpires: 7 * 24 * 60 * 60 * 1000,
  genAccessToken: (payload) => {
    const token = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: tokenService.accessTokenExpires,
    });
    return token;
  },

  genRefreshToken: (payload) => {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: tokenService.refreshTokenExpires,
    });
    return token;
  },
};

module.exports = tokenService;
