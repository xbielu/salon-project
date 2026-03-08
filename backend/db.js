const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  user: "root",
  password: "",
  database: "salon",

  // 🔥 KLUCZOWE NA macOS + XAMPP
  socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
