require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

const langs = require('./languages.json');
var detectLang = require('lang-detector');

function deleteExpiredDocuments() {
  prisma.paste.deleteMany({ where: { created_at: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
    .catch(err => {
      console.error('Error deleting expired pastes:', err);
    });
}

setInterval(deleteExpiredDocuments, 24 * 60 * 60 * 1000);

app.get('/', (req, res) => {
  res.render('new');
});

app.post('/save', async (req, res) => {
  const value = req.body.value;
  const lang = detectLang(value);
  const id = `${Math.random().toString(36).substring(2, 9)}${lang !== 'Unknown' ? langs[lang] : ''}`;
  try {
    await prisma.paste.create({ data: { id, value } });
    res.redirect(`/${id}`);
  } catch (err) {
    console.error('Error saving pastes:', err);
    res.render('new', { value });
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const paste = await prisma.paste.findUnique({ where: { id } });
    if (paste) {
      res.render('new', { value: paste.value });
    } else {
      res.redirect(`/${id}`);
    }
  } catch (err) {
    res.redirect(`/${id}`);
  }
});

app.get('/:id/raw', async (req, res) => {
  const id = req.params.id;
  try {
    const paste = await prisma.paste.findUnique({ where: { id } });
    if (paste) {
      res.render('raw', { code: paste.value });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const paste = await prisma.paste.findUnique({ where: { id } });
    if (paste) {
      res.render('code-display', { code: paste.value, id });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.listen(process.env.port, () =>
  console.log(`The hastebin server is now running on port ${process.env.port}`)
);