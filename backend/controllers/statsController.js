const db = require("../db");


exports.range = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "Brak zakresu dat" });
    }

    const [weeks] = await db.query(`
      SELECT
        YEARWEEK(appointment_date, 1) AS week,

        COUNT(*) AS visits
        
      FROM Appointments
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY week
      ORDER BY week
    `, [from, to]);

    const [months] = await db.query(`
      SELECT
        DATE_FORMAT(appointment_date, '%Y-%m') AS month,
        COUNT(*) AS visits
      FROM Appointments
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY month
      ORDER BY month
    `, [from, to]);

    const [hairdressers] = await db.query(`
      SELECT
        CONCAT(h.first_name, ' ', h.last_name) AS hairdresser,
        COUNT(*) AS visits
      FROM Appointments a
      JOIN Hairdressers h ON a.hairdresser_id = h.id
      WHERE a.appointment_date BETWEEN ? AND ?
      GROUP BY hairdresser
      ORDER BY visits DESC
    `, [from, to]);

    res.json({
      weeks,
      months,
      hairdressers
    });

  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "Błąd statystyk" });
  }
};
