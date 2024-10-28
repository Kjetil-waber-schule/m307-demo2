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

app.get("/TrainingOverview", async function (req, res) {
  const uebersicht = await app.locals.pool.query(
    "SELECT t.*, tr.vorname AS Trainer_Vorname, tr.name AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.Athlet_ID = 3;"
  );
  for (const u of uebersicht.rows) {
    u.zeitpunkt = u.zeitpunkt.toLocaleDateString("de-DE");
  }
  res.render("TrainingOverview", { uebersicht: uebersicht.rows });
});

app.get("/Trainingsdetails/:id", async function (req, res) {
  const details = await app.locals.pool.query(
    "SELECT t.*, tr.vorname AS Trainer_Vorname, tr.name AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.id = $1;",
    [req.params.id]
  );
  for (const d of details.rows) {
    d.zeitpunkt = d.zeitpunkt.toLocaleDateString("de-DE");
  }
  res.render("Trainingsdetails", { details: details.rows });
});

app.post("/create_training", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO training (athlet_ID, zeitpunkt, erholungszustand, stimmung, intensitaet, foto, text, zugehoerigkeit_id) VALUES (3, $1, $2, $3, $4, $5, $6, (SELECT id from zugehoerigkeit WHERE athlet_id = 3 LIMIT 1))",
    [
      req.body.date,
      req.body.RecoveryRange,
      req.body.MoodRange,
      req.body.IntensityRange,
      req.body.ImageUpload,
      req.body.Comment,
    ]
  );
  res.redirect("/TrainingOverview");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
