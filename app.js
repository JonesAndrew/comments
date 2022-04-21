const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

comments = [];

app.get('/api/comments', (req, res) => {
  res.send(comments)
})

app.post('/api/comment', (req, res) => {
  comments.push(req.body);
  res.send("good job!");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})