import { createApp, upload } from "./config.js"; // Wir holen uns die Werkzeuge `createApp` und `upload` aus der Datei "config.js".

// Wir erstellen die App (das Haus) mit den angegebenen Informationen.
const app = createApp({
  user: "cool_night_3894", // Benutzername für die Datenbank (Besitzer des Hauses)
  host: "bbz.cloud", // Adresse der Datenbank (Adresse des Hauses)
  database: "cool_night_3894", // Name der Datenbank (Zimmer, in dem alle Informationen gespeichert sind)
  password: "0aab0c9c83cdcf20994ec3a5a5bc6acb", // Passwort für die Datenbank (Passwort für das Zimmer)
  port: 30211, // Port der Datenbank (Nummer der Tür zum Haus)
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {}); // Zeige die "Start"-Seite, wenn jemand die Webseite besucht (Eingangsbereich).
});

/* Impressum */
app.get("/impressum", async function (req, res) {
  res.render("impressum", {}); // Zeige die "Impressum"-Seite (Informationen über den Hausbesitzer).
});

/* Athleten-Startseite */
app.get("/AthletHome", (req, res) => {
  if (!req.session.userid) {
    // Prüfe, ob der Besucher einen Sportler-Ausweis hat (`userid`).
    res.redirect("/"); // Wenn nicht, schicke ihn zurück zur Startseite.
    return;
  }
  res.render("AthletHome"); // Wenn ja, zeige ihm die "AthletHome"-Seite (Wohnzimmer für Sportler).
});

/* Trainer-Startseite */
app.get("/TrainerHome", (req, res) => {
  if (!req.session.trainerId) {
    // Prüfe, ob der Besucher einen Trainer-Ausweis hat (`trainerId`).
    return res.redirect("/trainerLogin"); // Wenn nicht, schicke ihn zur Trainer-Anmeldung.
  }
  res.render("TrainerHome"); // Wenn ja, zeige ihm die "TrainerHome"-Seite (Büro für Trainer).
});

/* Trainings-Eintrag für Athleten */
app.get("/AthletTrainingEntry", (req, res) => {
  if (!req.session.userid) {
    // Prüfe den Sportler-Ausweis.
    res.redirect("/");
    return;
  }
  res.render("AthletTrainingEntry"); // Zeige das Formular zum Eintragen des Trainings (Trainingsbuch für Sportler).
});

/* Trainingsübersicht für Athleten */
app.get("/TrainingOverview", async function (req, res) {
  if (!req.session.userid) {
    // Prüfe den Sportler-Ausweis.
    res.redirect("/");
    return;
  }
  // Hole die Trainingsdaten des Sportlers aus der Datenbank (Liste aller Trainingseinheiten).
  const uebersicht = await app.locals.pool.query(
    "SELECT t.*, tr.vorname AS Trainer_Vorname, tr.nachname AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.Athlet_ID = $1;",
    [req.session.userid]
  );
  for (const u of uebersicht.rows) {
    // Gehe jede Trainingseinheit durch.
    u.zeitpunkt = u.zeitpunkt.toLocaleDateString("de-DE"); // Formatiere das Datum schöner (z.B. "01.01.2023").
  }
  res.render("TrainingOverview", { uebersicht: uebersicht.rows }); // Zeige die Übersicht der Trainingseinheiten.
});

/* Trainingsübersicht für Trainer */
app.get("/TrainingOverviewTrainer", async function (req, res) {
  if (!req.session.trainerId) {
    // Prüfe den Trainer-Ausweis.
    res.redirect("/");
    return;
  }

  // Hole die Trainingsdaten aller Sportler des Trainers aus der Datenbank.
  const uebersicht = await app.locals.pool.query(
    "SELECT t.*, a.vorname AS Athlet_Vorname, a.nachname AS Athlet_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN athlets AS a ON z.Athlet_ID = a.ID WHERE z.Trainer_ID = $1;",
    [req.session.trainerId]
  );

  for (const u of uebersicht.rows) {
    // Gehe jede Trainingseinheit durch.
    u.zeitpunkt = u.zeitpunkt.toLocaleDateString("de-DE"); // Formatiere das Datum schöner.
  }

  res.render("TrainingOverviewTrainer", { uebersicht: uebersicht.rows }); // Zeige die Übersicht der Trainingseinheiten.
});

/* Trainingsdetails für Athleten */
app.get("/Trainingsdetails/:id", async function (req, res) {
  if (!req.session.userid) {
    // Prüfe den Sportler-Ausweis.
    res.redirect("/");
    return;
  }
  // Hole die Details der Trainingseinheit mit der angegebenen ID aus der Datenbank.
  const details = await app.locals.pool.query(
    "SELECT t.*, tr.vorname AS Trainer_Vorname, tr.nachname AS Trainer_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN trainers AS tr ON z.Trainer_ID = tr.ID WHERE t.id = $1;",
    [req.params.id] // :id ist die Nummer der Trainingseinheit
  );
  for (const d of details.rows) {
    // Gehe jede Trainingseinheit durch (sollte nur eine sein).
    d.zeitpunkt = d.zeitpunkt.toLocaleDateString("de-DE"); // Formatiere das Datum schöner.
  }
  res.render("Trainingsdetails", {
    details: details.rows,
    foto: details.rows[0].foto, // Zeige das Foto, falls vorhanden.
  }); // Zeige die Details der Trainingseinheit.
});

/* Trainingsdetails für Trainer */
app.get("/TrainingsdetailsTrainer/:id", async function (req, res) {
  if (!req.session.trainerId) {
    // Prüfe den Trainer-Ausweis.
    res.redirect("/");
    return;
  }
  // Hole die Details der Trainingseinheit mit der angegebenen ID aus der Datenbank (sehr ähnlich wie oben).
  const details = await app.locals.pool.query(
    "SELECT t.*, a.vorname AS Athlet_Vorname, a.nachname AS Athlet_Name FROM Training AS t JOIN zugehoerigkeit AS z ON t.Zugehoerigkeit_ID = z.ID JOIN athlets AS a ON z.Athlet_ID = a.ID WHERE z.Trainer_ID = $1;",
    [req.session.trainerId]
  );
  for (const d of details.rows) {
    d.zeitpunkt = d.zeitpunkt.toLocaleDateString("de-DE");
  }
  res.render("TrainingsdetailsTrainer", {
    details: details.rows,
    foto: details.rows[0].foto,
  });
});

/* Neue Trainingseinheit erstellen */
app.post("/create_training", upload.single("image"), async function (req, res) {
  if (!req.session.userid) {
    // Prüfe den Sportler-Ausweis.
    res.redirect("/");
    return;
  }
  // Speichere die neue Trainingseinheit in der Datenbank.
  await app.locals.pool.query(
    "INSERT INTO training (athlet_ID, zeitpunkt, erholungszustand, stimmung, intensitaet, foto, text, zugehoerigkeit_id) VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT id from zugehoerigkeit WHERE athlet_id = $1 LIMIT 1))",
    [
      req.session.userid,
      req.body.date, // Datum
      req.body.RecoveryRange, // Erholungszustand
      req.body.MoodRange, // Stimmung
      req.body.IntensityRange, // Intensität
      req.file.filename, // Dateiname des Fotos
      req.body.Comment, // Kommentar
    ]
  );
  res.redirect("/AthletHome"); // Schicke den Sportler zurück zu seiner Startseite.
});

/* Trainingsgruppenverwaltung für Trainer */
app.get("/traininggroup", (req, res) => {
  if (!req.session.trainerId) {
    // Prüfe den Trainer-Ausweis.
    return res.redirect("/trainerLogin");
  }

  res.render("traininggroup"); // Zeige die Seite zur Verwaltung der Trainingsgruppen.
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`); // Öffne die Türen des Hauses und warte auf Besucher (Webseite ist jetzt erreichbar).
});
