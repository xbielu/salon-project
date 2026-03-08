const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/hairdressersController");

router.get("/", ctrl.list);
router.post("/", ctrl.add);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
