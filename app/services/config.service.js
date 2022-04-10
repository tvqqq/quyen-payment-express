const { CRUDService } = require("./crud.service");
const Config = require("../models/config.model");

class ConfigService extends CRUDService {
  constructor() {
    super(Config);
  }

  getGoogleTokens = async () => {
    return await this.getModel().findById(process.env.ID_CONFIG_GOOGLE_TOKEN);
  };
}

module.exports = { ConfigService };
