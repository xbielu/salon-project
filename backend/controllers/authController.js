const db = require("../db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [admin] = await db.query(
    "SELECT * FROM users WHERE email=? AND password=? AND role='Admin'",
    [email, password]
  );

  if (admin.length) {
    return res.json({ success: true, type: "admin" });
  }

  const [h] = await db.query(
    "SELECT * FROM hairdressers WHERE email=? AND password=?",
    [email, password]
  );

  if (h.length) {
    return res.json({ success: true, type: "hairdresser", hairdresser: h[0] });
  }

  res.status(401).json({ success: false });
};
