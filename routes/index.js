const { Router } = require("express");
const router = Router();
const momoRoutes = require("./momo.route");
const configRoutes = require("./config.route");

router.get("/", (req, res) =>
  res.send("Hello World from quyen-payment-express1")
);

router.use("/momo", momoRoutes);
router.use("/configs", configRoutes);

module.exports = router;
