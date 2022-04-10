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
    let tokens = await this.configService.getGoogleTokens();
    const client = this.getBaseClient();
    client.setCredentials(tokens.value);

    if (client.isTokenExpiring()) {
      const { credentials } = await client.refreshAccessToken();
      tokens = { ...credentials, refresh_token: tokens.refresh_token };
      await this.configService.getGoogleTokens().updateOne({
        value: tokens,
      });
      client.setCredentials(tokens);
    }

    return client;
  };
}

module.exports = { GoogleService };
