const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const PORT = 3002
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (request, response) {
  response.render('index',
    {
      title: 'node'
    });
});

let notes = [];
let arrayClients = []

app.get('/all', function (req, res) {
  res.json(notes);
});

app.get('/client/all', function (req, res) {
  res.json(arrayClients);
});

app.post('/new', function (req, res) {
  const newNote = req.body;
  notes = notes.filter(value => value.idRecord !== newNote.idRecord);
  notes.push(newNote);
  res.json({});
});

app.post('/client', function (req, res) {
  const client = req.body;
  let result = arrayClients.every(elem => elem.userName !== client.userName);
  arrayClients.forEach((element) => {
    if (result) {
      arrayClients.push(client);
      result = false
    } else if (element.userName === client.userName && element.idRecord < client.idRecord) {
      element.idRecord = client.idRecord;
      element.day = client.day;
     } 
    if (element.userName === client.userName && client.phoneNumber) {
      element.phoneNumber = client.phoneNumber;
    }
  })
  if (arrayClients.length === 0) {
    arrayClients.push(client);
  }
  res.json({});
});

app.delete('/delete', (request, response) => {
  const noteId = request.body.idRecord;
  notes = notes.filter(note => note.idRecord !== noteId);
  response.send('ok');
});

app.delete('/deleteclient', (request, response) => {
  const noteName = request.body.userName;
  arrayClients = arrayClients.filter(note => note.userName !== noteName);
  notes = notes.filter(note => note.userName !== noteName);
  response.send('ok');
});


app.listen(PORT, () => {
  console.log(`${PORT} запущен`)
})


























