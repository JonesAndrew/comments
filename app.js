const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const uuid  = require('uuid');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

comments = [];

app.get('/api/comments', (req, res) => {
  res.send(comments)
})

app.post('/api/comment', (req, res) => {
  let comment = req.body;
  comment.upvotes = 0;
  comment.id = uuid.v4();
  comments.push(comment);
  res.send("good job!");
})

app.post('/api/upvote', (req, res) => {
  comments.forEach((c) => {
    if (c.id === req.body.comment_id)
      c.upvotes++;
  })
  res.send("good job!");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})