import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;
  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.post("/register", function (req, res) {
    var password = bcrypt.hashSync(req.body.password, 10);
    pool.query(
      "INSERT INTO athlets (email, password, vorname, nachname) VALUES ($1, $2, $3, $4)",
      [req.body.email, password, req.body.vorname, req.body.nachname],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/");
      }
    );
  });

  app.get("/trainerRegister", function (req, res) {
    res.render("trainerRegister");
  });

  app.post("/trainerRegister", function (req, res) {
    var password = bcrypt.hashSync(req.body.password, 10);
    pool.query(
      "INSERT INTO trainers (email, password, vorname, nachname) VALUES ($1, $2, $3, $4)",
      [req.body.email, password, req.body.vorname, req.body.nachname],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/trainerLogin");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login", function (req, res) {
    pool.query(
      "SELECT * FROM athlets WHERE email = $1",
      [req.body.email],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
          req.session.userid = result.rows[0].id;
          res.redirect("/athletHome");
        } else {
          res.redirect("/");
        }
      }
    );
  });

  app.get("/trainerLogin", function (req, res) {
    res.render("trainerLogin");
  });

  app.post("/trainerLogin", function (req, res) {
    pool.query(
      "SELECT * FROM trainers WHERE email = $1",
      [req.body.email],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
          req.session.trainerId = result.rows[0].id;
          res.redirect("/trainerHome");
        } else {
          res.redirect("/trainerLogin");
        }
      }
    );
  });
  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Fehler beim Löschen der Session:", err);
        res.redirect("/");
      } else {
        res.redirect("/");
      }
    });
  });
  return app;
}

export { upload };
