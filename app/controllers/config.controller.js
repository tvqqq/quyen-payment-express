const { ConfigService } = require("../services/config.service");
const { GoogleService } = require("../services/google.service");
const opn = require("open");
const url = require("url");

class ConfigController {
  constructor() {
    this.configService = new ConfigService();
    this.googleService = new GoogleService();
  }

  googleLogin = async (req, res, next) => {
    const oauth2Client = this.googleService.getOauth2Client();
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
    });
    opn(authorizeUrl);
    return res.status(200).json({
      success: true,
    });
  };

  googleCallback = async (req, res, next) => {
    const oauth2Client = this.googleService.getOauth2Client();
    const qs = new url.URL(req.url, process.env.APP_URL).searchParams;
    const data = await oauth2Client.getToken(qs.get("code"));
    await this.configService.getGoogleTokens().updateOne({
      value: data.tokens,
    });
    return res.status(200).json({
      success: true,
      data,
    });
  };
}

module.exports = new ConfigController();
