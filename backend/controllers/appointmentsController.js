const db = require("../db");
console.log("NEW CREATE VERSION RUNNING");

exports.create = async (req, res) => {
  try {
    const {
      client_name,
      client_email,
      client_phone,
      hairdresser_id,
      service_id,
      appointment_date,
      appointment_time
    } = req.body;

// Check if required fields are missing

    if (!client_name || !client_email || !hairdresser_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "Missing data" });
    }
// Check if required fields are missing

    if (client_name.length > 80) {
      return res.status(400).json({ error: "Name too long" });
    }

// Validate email format using regular expression
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    
// Validate phone number (exactly 9 digits)
    if (client_phone && !/^\d{9}$/.test(client_phone)) {
      return res.status(400).json({ error: "Invalid phone" });
    }

    const parts = client_name.trim().split(" ");
    const first_name = parts.shift();
    const last_name = parts.join(" ") || "-";

    const [[existingUser]] = await db.query(
      "SELECT user_id FROM Users WHERE email = ?",
      [client_email]
    );

    let clientId;

    if (existingUser) {
      clientId = existingUser.user_id;
    } else {
      const [user] = await db.query(
        `INSERT INTO Users (first_name, last_name, email, phone, role)
         VALUES (?, ?, ?, ?, 'Client')`,
        [first_name, last_name, client_email, client_phone || null]
      );
      clientId = user.insertId;
    }

    await db.query(
      `INSERT INTO Appointments
       (client_id, hairdresser_id, service_id, appointment_date, appointment_time)
       VALUES (?, ?, ?, ?, ?)`,
      [clientId, hairdresser_id, service_id, appointment_date, appointment_time]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("CREATE APPOINTMENT ERROR:", err);
    res.status(500).json({ error: "create failed" });
  }
};

exports.byDate = async (req, res) => {
  try {
    const date = req.params.date;

    const [rows] = await db.query(
      `
      SELECT
        a.appointment_id,
        a.appointment_time,
        u.first_name AS client_first,
        u.last_name  AS client_last,
        h.first_name AS hairdresser_first,
        h.last_name  AS hairdresser_last,
        s.service_name_pl AS service
      FROM Appointments a
      JOIN Users u ON u.user_id = a.client_id
      JOIN Hairdressers h ON h.id = a.hairdresser_id
      JOIN Services s ON s.service_id = a.service_id
WHERE DATE(a.appointment_date) = ?

      ORDER BY a.appointment_time
      `,
      [date]
    );

    res.json(rows);
  } catch (err) {
    console.error("BY DATE ERROR:", err);
    res.status(500).json({ error: "byDate failed" });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(
      `DELETE FROM Appointments WHERE appointment_id = ?`,
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "delete failed" });
  }
};


exports.times = async (req, res) => {
  try {
    const { hairdresser_id, date } = req.params;

    const [schedules] = await db.query(
      `SELECT start_time, end_time
       FROM Schedules
       WHERE hairdresser_id = ? AND work_date = ?
       ORDER BY start_time`,
      [hairdresser_id, date]
    );

    if (!schedules.length) {
      return res.json([]);
    }

    const [busy] = await db.query(
      `SELECT appointment_time
       FROM Appointments
       WHERE hairdresser_id = ? AND appointment_date = ?`,
      [hairdresser_id, date]
    );
// Create a Set containing already booked appointment times
// Using Set allows O(1) average lookup time
    const taken = new Set(
      busy.map(b => b.appointment_time.slice(0, 5)) 
       // Extract only HH:MM from time string
    );

    const result = [];

// Loop through each working schedule for a given hairdresser
    for (const schedule of schedules) {

 // Convert start time to numeric hours and minutes
      let [h, m] = schedule.start_time.slice(0, 5).split(":").map(Number);
 // Get end time of working period

      const end = schedule.end_time.slice(0, 5);

 // Infinite loop to generate 30-minute slots
      while (true) {
        const t = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        // Stop loop when reaching end of working hours

        if (t >= end) break;
// If time slot is not already booked, add it to results
        if (!taken.has(t)) {
          result.push(t);
        }
     // Move forward by 30 minutes
        m += 30;
         // Adjust hour if minutes exceed 60

        if (m >= 60) {
          m = 0;
          h++;
        }
      }
    }

    res.json(result);

  } catch (err) {
    console.error("TIMES ERROR:", err);
    res.status(500).json([]);
  }
};

