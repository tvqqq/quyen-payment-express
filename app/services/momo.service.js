const { CRUDService } = require("./crud.service");
const Momo = require("../models/momo.model");

class MomoService extends CRUDService {
  constructor() {
    super(Momo);
  }
}

module.exports = { MomoService };
