const { DdbService } = require("../services/ddb.service");
const { TcbService } = require("../services/tcb.service");

class TcbController {
  constructor() {
    this.tcbService = new TcbService();
    this.ddbService = new DdbService();
  }

  getRefresh = async (req, res, next) => {
    // the token in .env to avoid spamming from web / client
    if (
      !req.query.bypass ||
      (req.query.bypass &&
        req.query.bypass !== process.env.TOKEN_BYPASS_REFRESH)
    ) {
      return res.status(400).json({
        success: false,
        message: "No bypass",
      });
    }
    const refreshToken = await this.ddbService.getKey("refresh_token");
    const newToken = await this.tcbService.getNewToken(refreshToken);
    const aT = await this.ddbService.updateKey(
      "access_token",
      newToken.access_token
    );

    return res.status(200).json({
      success: true,
    });
  };

  getTransaction = async (req, res, next) => {
    const accessToken = await this.ddbService.getKey("access_token");
    const response = await this.tcbService.getTransaction(accessToken, "");

    return res.status(200).json({
      success: true,
      data: response,
    });
  };
}

module.exports = new TcbController();
