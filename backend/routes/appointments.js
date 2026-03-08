const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentsController");

router.post("/", ctrl.create);
router.get("/date/:date", ctrl.byDate);
router.get("/times/:hairdresser_id/:date", ctrl.times);
router.delete("/:id", ctrl.remove);

module.exports = router;
