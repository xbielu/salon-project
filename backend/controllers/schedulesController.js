const db = require("../db");

exports.save = async (req, res) => {
  const {
    schedule_id,
    hairdresser_id,
    work_date,
    start_time,
    end_time
  } = req.body;

  const id = schedule_id ? Number(schedule_id) : null;

  if (!hairdresser_id || !work_date || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: "Missing required schedule data"
    });
  }

  if (start_time >= end_time) {
    return res.status(400).json({
      success: false,
      message: "Godzina początkowa musi być wcześniejsza niż końcowa"
    });
  }

  try {
const [overlap] = await db.query(
  `
  SELECT schedule_id
  FROM Schedules
  WHERE hairdresser_id = ?
    AND work_date = ?
    AND (? IS NULL OR schedule_id != ?)
    AND start_time < ?
    AND end_time > ?
  `,
  [
    hairdresser_id,
    work_date,
    id, id,
    end_time,
    start_time
  ]
);

if (overlap.length) {
  return res.status(400).json({
    success: false,
    message: "Ten grafik nakłada się na istniejący grafik tego fryzjera"
  });
}


    // 💾 ZAPIS
    if (id) {
      await db.query(
        `
        UPDATE Schedules
        SET hairdresser_id=?, work_date=?, start_time=?, end_time=?
        WHERE schedule_id=?
        `,
        [hairdresser_id, work_date, start_time, end_time, id]
      );
    } else {
      await db.query(
        `
        INSERT INTO Schedules (hairdresser_id, work_date, start_time, end_time)
        VALUES (?, ?, ?, ?)
        `,
        [hairdresser_id, work_date, start_time, end_time]
      );
    }

    res.json({ success: true });

  } catch (err) {
    console.error("SAVE SCHEDULE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while saving schedule"
    });
  }
};



exports.byDate = async (req, res) => {
  const { date } = req.query;

  const [rows] = await db.query(`
    SELECT s.schedule_id, s.hairdresser_id, s.start_time, s.end_time,
           h.first_name, h.last_name
    FROM Schedules s
    JOIN Hairdressers h ON h.id = s.hairdresser_id
    WHERE s.work_date = ?
    ORDER BY s.start_time
  `, [date]);

  res.json(rows);
};

exports.month = async (req, res) => {
  const { year, month } = req.params;

  const [rows] = await db.query(`
    SELECT DISTINCT work_date FROM Schedules
    WHERE work_date BETWEEN ? AND ?
  `, [`${year}-${month}-01`, `${year}-${month}-31`]);

  res.json(rows);
};

exports.delete = async (req, res) => {
  await db.query("DELETE FROM Schedules WHERE schedule_id=?", [req.params.id]);
  res.json({ success: true });
};
exports.byHairdresser = async (req, res) => {
  const [rows] = await db.query(`
    SELECT work_date, start_time, end_time
    FROM Schedules
    WHERE hairdresser_id=?
    ORDER BY work_date
  `, [req.params.id]);

  res.json(rows);
};
