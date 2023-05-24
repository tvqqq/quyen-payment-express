const { Router } = require("express");
const router = Router();
const momoRoutes = require("./momo.route");
const configRoutes = require("./config.route");
const tcbRoutes = require("./tcb.route");

router.get("/", (req, res) =>
  res.send("Hello World from quyen-payment-express1")
);

router.use("/momo", momoRoutes);
router.use("/configs", configRoutes);
router.use("/tcb", tcbRoutes);

module.exports = router;
