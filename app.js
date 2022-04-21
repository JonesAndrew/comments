const sqlite3 = require('sqlite3');
const express = require('express');
const ws = require('ws');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const uuid  = require('uuid');

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message));
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/comments', (req, res) => {
  db.all(`SELECT comments.comment_id, comments.timestamp, comments.name, parent_id, comment, count(upvotes.name) AS upvotes
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

  db.get(`INSERT INTO comments(comment_id, name, comment, parent_id) VALUES (?, ?, ?, ?)`, [uuid.v4(), comment.name, comment.comment, comment.parent_id], (err, row) => {
    if (err) {
      res.status(400);
      return;
    }

    res.send("good job!");

    wsServer.clients.forEach(function each(client) {
       client.send('refresh');
    });
  });
})

app.post('/api/upvote', (req, res) => {
  console.log(req.body)
  db.get(`INSERT INTO upvotes(comment_id, name) VALUES (?, ?)`, [req.body.comment_id, req.body.name], (err, row) => {
    if (err) {
      res.status(400);
      return;
    }

    res.send("good job!");
  
    wsServer.clients.forEach(function each(client) {
       client.send('refresh');
    });
  });
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

const db = new sqlite3.Database('./comments.db', (err) => {
  if (err) {
    console.error("Can't open db");
    return;
  }

  db.run('CREATE TABLE comments(comment_id TEXT PRIMARY KEY, name text, comment text, parent_id TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
    if (err)
      console.log('Hopefully the tables already exist', err);
  });

  db.run('CREATE TABLE upvotes(comment_id TEXT, name text, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(comment_id, name))', (err) => {
    if (err)
      console.log('Hopefully the tables already exist', err);
  });
})