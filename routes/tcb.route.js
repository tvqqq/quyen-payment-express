const { Router } = require("express");
const router = Router();

const tcbController = require("../app/controllers/tcb.controller");

router.get("/transaction", tcbController.getTransaction);
router.get("/refresh", tcbController.getRefresh);

module.exports = router;
