const db = require("../db");

exports.list = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Services");
  res.json(rows);
};

exports.add = async (req, res) => {
  const { service_name_pl, service_name_en, price } = req.body;
  await db.query(
    "INSERT INTO Services (service_name_pl, service_name_en, price) VALUES (?, ?, ?)",
    [service_name_pl, service_name_en, price]
  );
  res.json({ success: true });
};

exports.update = async (req, res) => {
  const { service_name_pl, service_name_en, price } = req.body;
  await db.query(
    "UPDATE Services SET service_name_pl=?, service_name_en=?, price=? WHERE service_id=?",
    [service_name_pl, service_name_en, price, req.params.id]
  );
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  await db.query(
    "DELETE FROM Services WHERE service_id=?",
    [req.params.id]
  );
  res.json({ success: true });
};
