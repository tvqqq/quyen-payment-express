const { ConfigService } = require("../services/config.service");
const { GoogleService } = require("../services/google.service");
class ConfigController {
  constructor() {
    this.configService = new ConfigService();
    this.googleService = new GoogleService();
  }

  googleLogin = async (req, res, next) => {
    const oauth2Client = this.googleService.getBaseClient();
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
    });
    return res.status(200).json({
      success: true,
      authorizeUrl,
    });
  };

  googleCallback = async (req, res, next) => {
    const params = new URLSearchParams(req.url);
    const code = params.get("/google/callback?code");
    const oauth2Client = this.googleService.getBaseClient();
    const data = await oauth2Client.getToken(code);
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
