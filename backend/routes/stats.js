const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/statsController");

router.get("/range", ctrl.range);

module.exports = router;
