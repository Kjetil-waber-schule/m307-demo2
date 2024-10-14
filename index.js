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

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.get("/AthletHome", (req, res) => {
  res.render("AthletHome");
});

app.get("/AthletTrainingEntry", (req, res) => {
  res.render("AthletTrainingEntry");
});

app.get("/TrainingOverview", (req, res) => {
  res.render("TrainingOverview");
});

app.get("/TrainingOverview", async function (req, res) {
  const uebersicht = await app.locals.pool.query(
    "SELECT t.zeitpunkt, t.erholungszustand, t.stimmung, t.intensitaet, t.foto, t.text, tr.vorname AS Trainer_Vorname, tr.name AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.Athlet_ID = 3;"
  );
  console.log(uebersicht);
  res.render("TrainingOverview", { uebersicht: uebersicht.rows });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
