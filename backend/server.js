

console.log("SERVER BOOTED FROM:", __filename);

const express = require("express");
const path = require("path");
const db = require("./db");


const app = express();

app.use(express.json());

app.use("/hairdressers", require("./routes/hairdressers"));
app.use("/services", require("./routes/services"));
app.use("/appointments", require("./routes/appointments"));
app.use("/schedules", require("./routes/schedules"));
app.use("/auth", require("./routes/auth"));
app.use("/stats", require("./routes/stats"));

const FRONTEND_PATH = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND_PATH));

app.use((req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT", PORT);
});
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});