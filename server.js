  require('dotenv').config();
  const express = require("express");
  const app = express();
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));

  const Document = require("./models/Document");
  const mongoose = require("mongoose");
  const detectLang = require('lang-detector');
  const langs = require('./languages.json')

  mongoose.connect(process.env.mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  app.get("/", (req, res) => {
    res.render("new");
  });

  app.post("/save", async (req, res) => {
    const value = req.body.value;
    const lang = await detectLang(value);
    const id = `${Math.random().toString(36).substring(2, 9)}${lang !== 'Unknown' ? langs[lang] : ''}`;
    try {
      const document = await Document.create({
        value: value,
        id: id
      });
      res.redirect(`/${id}`);
    } catch (e) {
      res.render("new", { value });
    };
  });

  app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;
    try {
      const document = await Document.findOne({
        id: id,
      });
      res.render("new", { value: document.value });
    } catch (e) {
      res.redirect(`/${id}`);
    };
  });

  app.get("/:id/raw", async (req, res) => {
    const id = req.params.id;
    try {
      const document = await Document.findOne({
        id: id,
      });
      res.render("raw", { code: document.value });
    } catch (e) {
      res.redirect(`/`);
    };
  });

  app.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const document = await Document.findOne({
        id: id,
      });

      res.render("code-display", { code: document.value, id });
    } catch (e) {
      res.redirect("/");
    };
  });

  app.listen(process.env.port, () => console.log(`The hastebin server is now running on port ${process.env.port}`));