const db = require("../db");

exports.list = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM hairdressers ORDER BY first_name"
    );
    res.json(rows);
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.add = async (req, res) => {
  try {
    const { first_name, last_name, email, password, photo_url, description } = req.body;

    await db.query(
      "INSERT INTO hairdressers (first_name,last_name,email,password,photo_url,description) VALUES (?,?,?,?,?,?)",
      [first_name, last_name, email, password, photo_url, description]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ success: false });
  }
};


exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, last_name, email, password, photo_url, description } = req.body;

    await db.query(
      "UPDATE hairdressers SET first_name=?,last_name=?,email=?,password=?,photo_url=?,description=? WHERE id=?",
      [first_name, last_name, email, password, photo_url, description, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query("DELETE FROM hairdressers WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
};
