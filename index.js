import { createApp, upload } from "./config.js";

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

app.get("/AthletHome", (req, res) => {
  if (!req.session.userid) {
    res.redirect("/");
    return;
  }
  res.render("AthletHome");
});
app.get("/TrainerHome", (req, res) => {
  if (!req.session.trainerId) {
    return res.redirect("/trainerLogin");
  }
  res.render("TrainerHome");
});

app.get("/AthletTrainingEntry", (req, res) => {
  if (!req.session.userid) {
    res.redirect("/");
    return;
  }
  res.render("AthletTrainingEntry");
});

app.get("/TrainingOverview", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/");
    return;
  }
  const uebersicht = await app.locals.pool.query(
    "SELECT t.*, tr.vorname AS Trainer_Vorname, tr.nachname AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.Athlet_ID = $1;",
    [req.session.userid]
  );
  for (const u of uebersicht.rows) {
    u.zeitpunkt = u.zeitpunkt.toLocaleDateString("de-DE");
  }
  res.render("TrainingOverview", { uebersicht: uebersicht.rows });
});

app.get("/Trainingsdetails/:id", async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/");
    return;
  }
  const details = await app.locals.pool.query(
    "SELECT t.*, tr.vorname AS Trainer_Vorname, tr.nachname AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.id = $1;",
    [req.params.id]
  );
  for (const d of details.rows) {
    d.zeitpunkt = d.zeitpunkt.toLocaleDateString("de-DE");
  }
  res.render("Trainingsdetails", {
    details: details.rows,
    foto: details.rows[0].foto,
  });
});

app.post("/create_training", upload.single("image"), async function (req, res) {
  if (!req.session.userid) {
    res.redirect("/");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO training (athlet_ID, zeitpunkt, erholungszustand, stimmung, intensitaet, foto, text, zugehoerigkeit_id) VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT id from zugehoerigkeit WHERE athlet_id = $1 LIMIT 1))",
    [
      req.session.userid,
      req.body.date,
      req.body.RecoveryRange,
      req.body.MoodRange,
      req.body.IntensityRange,
      req.body.filename,
      req.body.Comment,
    ]
  );
  res.redirect("/AthletHome");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
