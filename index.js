import { createApp } from "./config.js";

const app = createApp({
  user: "autumn_star_7622",
  host: "168.119.168.41",
  database: "demo",
  password: "uaioysdfjoysfdf",
  port: 18324,
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
