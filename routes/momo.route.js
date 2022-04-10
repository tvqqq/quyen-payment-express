const { Router } = require("express");
const router = Router();

const momoController = require("../app/controllers/momo.controller");

router.post("/webhook", momoController.webhook);
router.get("/query", momoController.queryTransactionId);

module.exports = router;
