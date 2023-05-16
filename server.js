require('dotenv').config();
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql2');
const detectLang = require('lang-detector');
const langs = require('./languages.json');

const connection = mysql.createConnection({
  host: process.env.mysqlHost,
  user: process.env.mysqlUser,
  password: process.env.mysqlPassword,
  database: process.env.mysqlDatabase,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.mysqlPassword + '\0')
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

function deleteExpiredDocuments() {
  const query = 'DELETE FROM pastes WHERE created_at < NOW() - INTERVAL 7 DAY';
  connection.query(query, (err) => {
    if (err) {
      console.error('Error deleting expired pastes:', err);
    }
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
    const query = 'INSERT INTO pastes (id, value) VALUES (?, ?)';
    connection.query(query, [id, value], (err) => {
      if (err) {
        console.error('Error saving pastes:', err);
        res.render('new', { value });
      } else {
        res.redirect(`/${id}`);
      }
    });
  } catch (e) {
    res.render('new', { value });
  }
});

app.get("/:id/duplicate", (req, res) => {
  const id = req.params.id;
  try {
    const query = 'SELECT value FROM pastes WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err || results.length === 0) {
        res.redirect(`/${id}`);
      } else {
        res.render('new', { value: results[0].value });
      }
    });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

app.get('/:id/raw', (req, res) => {
  const id = req.params.id;
  try {
    const query = 'SELECT value FROM pastes WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err || results.length === 0) {
        res.redirect(`/`);
      } else {
        res.render('raw', { code: results[0].value });
      }
    });
  } catch (e) {
    res.redirect(`/`);
  }
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  try {
    const query = 'SELECT value FROM pastes WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err || results.length === 0) {
        res.redirect('/');
      } else {
        res.render('code-display', { code: results[0].value, id });
      }
    });
  } catch (e) {
    res.redirect('/');
  }
});

app.listen(process.env.port, () =>
  console.log(`The hastebin server is now running on port ${process.env.port}`)
);