const { Router } = require("express");
const router = Router();

const configController = require("../app/controllers/config.controller");

router.get("/google/login", configController.googleLogin);
router.get("/google/callback", configController.googleCallback);

module.exports = router;
