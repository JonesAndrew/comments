const sqlite3 = require('sqlite3');
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const uuid  = require('uuid');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/comments', (req, res) => {
  db.all(`SELECT comments.comment_id, comments.name, comment, count(upvotes.name) AS upvotes
          FROM comments LEFT JOIN upvotes ON comments.comment_id == upvotes.comment_id GROUP BY comments.comment_id`,
          [], (err, rows) => {

    if (err) {
      res.status(500);
      return;
    }

    res.send(rows);
  });
})

app.post('/api/comment', (req, res) => {
  let comment = req.body;

  db.get(`INSERT INTO comments(comment_id, name, comment) VALUES (?, ?, ?)`, [uuid.v4(), comment.name, comment.comment], (err, row) => {
    if (err) {
      res.status(400);
      return;
    }

    res.send("good job!");
  });
})

app.post('/api/upvote', (req, res) => {
  db.get(`INSERT INTO upvotes(comment_id, name) VALUES (?, ?)`, [req.body.comment_id, req.body.name], (err, row) => {
    if (err) {
      res.status(400);
      return;
    }

    res.send("good job!");
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const db = new sqlite3.Database('./comments.db', (err) => {
  if (err) {
    console.error("Can't open db");
    return;
  }

  db.run('CREATE TABLE comments(comment_id TEXT PRIMARY KEY, name text, comment text)', (err) => {
    if (err)
      console.log('Hopefully the tables already exist', err);
  });

  db.run('CREATE TABLE upvotes(comment_id TEXT, name text, PRIMARY KEY(comment_id, name))', (err) => {
    if (err)
      console.log('Hopefully the tables already exist', err);
  });
})