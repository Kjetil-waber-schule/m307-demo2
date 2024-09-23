import { createApp } from "./config.js";

const app = createApp({
  user: "cool_night_3894",
  host: "bbz.cloud",
  database: "cool_night_3894",
  password: "0aab0c9c83cdcf20994ec3a5a5bc6acb",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.get("/AthletHome", (req, res) => {
  res.render("AthletHome");
});

app.get("/AthletTrainingEntry", (req, res) => {
  res.render("AthletTrainingEntry");
});
