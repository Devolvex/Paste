require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const detectLang = require('lang-detector');
const langs = require('./languages.json');

function deleteExpiredDocuments() {
  prisma.paste.deleteMany({
    where: {
      createdAt: {
        lt: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  })
    .then(() => {
      console.log('Expired documents deleted');
    })
    .catch((err) => {
      console.error('Error deleting expired pastes:', err);
    });
}

setInterval(deleteExpiredDocuments, 24 * 60 * 60 * 1000);

app.get('/', (req, res) => {
  res.render('new');
});

app.post('/save', async (req, res) => {
  const value = req.body.value;
  const lang = await detectLang(value);
  const id = `${Math.random().toString(36).substring(2, 9)}${lang !== 'Unknown' ? langs[lang] : ''}`;
  try {
    await prisma.paste.create({
      data: {
        id,
        value,
      },
    });
    res.redirect(`/${id}`);
  } catch (e) {
    console.error('Error saving paste:', e);
    res.render('new', { value });
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const paste = await prisma.paste.findUnique({
      where: { id },
    });
    if (!paste) {
      res.redirect(`/${id}`);
    } else {
      res.render('new', { value: paste.value });
    }
  } catch (e) {
    console.error('Error fetching paste:', e);
    res.redirect(`/${id}`);
  }
});

app.get('/:id/raw', async (req, res) => {
  const id = req.params.id;
  try {
    const paste = await prisma.paste.findUnique({
      where: { id },
    });
    if (!paste) {
      res.redirect(`/`);
    } else {
      res.render('raw', { code: paste.value });
    }
  } catch (e) {
    console.error('Error fetching paste:', e);
    res.redirect(`/`);
  }
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const paste = await prisma.paste.findUnique({
      where: { id },
    });
    if (!paste) {
      res.redirect('/');
    } else {
      res.render('code-display', { code: paste.value, id });
    }
  } catch (e) {
    console.error('Error fetching paste:', e);
    res.redirect('/');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The hastebin server is now running on port ${port}`);
});