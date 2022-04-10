const { google } = require("googleapis");
const { ConfigService } = require("./config.service");

class GoogleService {
  constructor() {
    this.configService = new ConfigService();
  }

  getBaseClient = () => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.APP_URL + process.env.GOOGLE_CALLBACK_URL
    );

    return oauth2Client;
  };

  getRefreshGoogleClient = async () => {
    const currentTokens = await this.configService.getGoogleTokens().exec();
    const client = this.getBaseClient();
    client.setCredentials(currentTokens.value);

    // if (client.isTokenExpiring()) {
    if (true) {
      const newAccessToken = await client.refreshToken(
        currentTokens.value.refresh_token
      );
      const newTokens = {
        ...newAccessToken.tokens,
        refresh_token: currentTokens.value.refresh_token,
      };
      await this.configService.getGoogleTokens().updateOne({
        value: newTokens,
      });
      client.setCredentials(newTokens);
    }

    return client;
  };
}

module.exports = { GoogleService };
