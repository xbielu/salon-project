const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/month/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  const [rows] = await db.query(
    `
    SELECT DISTINCT work_date
    FROM schedules
    WHERE YEAR(work_date) = ?
      AND MONTH(work_date) = ?
    `,
    [year, month]
  );

  res.json(rows);
});

router.get("/byDate", async (req, res) => {
  const { date } = req.query;

  const [rows] = await db.query(
    `
    SELECT s.*, h.first_name, h.last_name
    FROM schedules s
    JOIN hairdressers h ON h.id = s.hairdresser_id
    WHERE s.work_date = ?
    ORDER BY s.start_time
    `,
    [date]
  );

  res.json(rows);
});

router.post("/save", async (req, res) => {
  const { schedule_id, hairdresser_id, work_date, start_time, end_time } = req.body;

  if (schedule_id) {
    await db.query(
      `
      UPDATE schedules
      SET hairdresser_id=?, work_date=?, start_time=?, end_time=?
      WHERE schedule_id=?
      `,
      [hairdresser_id, work_date, start_time, end_time, schedule_id]
    );
  } else {
    await db.query(
      `
      INSERT INTO schedules (hairdresser_id, work_date, start_time, end_time)
      VALUES (?,?,?,?)
      `,
      [hairdresser_id, work_date, start_time, end_time]
    );
  }

  res.json({ success: true });
});

router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM schedules WHERE schedule_id=?", [
    req.params.id
  ]);

  res.json({ success: true });
});

module.exports = router;
router.get("/hairdresser/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      `SELECT work_date, start_time, end_time
       FROM Schedules
       WHERE hairdresser_id = ?
       ORDER BY work_date, start_time`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("HAIRDRESSER SCHEDULE ERROR:", err);
    res.status(500).json([]);
  }
});

