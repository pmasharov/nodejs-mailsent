const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const nodemailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
//mongod --dbpath=/home/pmasharov/mongoDbDir
const assert = require('assert')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongodb config
const mongoDbUrl = 'mongodb://localhost:27017';
const dbName = 'mailSent'
let dbClient;

// Use connect method to connect to the server
MongoClient.connect(mongoDbUrl, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  dbClient = client
  app.locals.collection = client.db(dbName).collection('contacts');
  app.listen(8080)
});

//send email
const letSendMail = ({ recipient, message, subject, res }) => {
  const myEmailAddress = 'p.n.masharov';
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: myEmailAddress,
      pass: '18912518'
    }
  });
  const mailOptions = {
    from: myEmailAddress,
    to: recipient,
    subject: subject,
    text: message
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      const unSuccessData = { message: `something wrong with email sending` }
      console.log(error);
      return res.send(unSuccessData)
    } else {
      const successData = { message: `Email with subject '${subject}' sent to ${recipient}` }
      console.log('Email sent: ' + info.response);
      return res.send(successData)
    }
  });
}

app.get('/contacts', (req, res) => {
  const { collection } = req.app.locals;
  collection.find({}).toArray((err, contacts) => {
    const data = { contacts: [...contacts] }
    if (err) return console.log(err);
    return res.send(data)
  })
})
app.post('/contacts/add', (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const { email, name } = req.body
  const contact = { name, email };
  const collection = req.app.locals.collection;
  collection.insertOne(contact, function (err, result) {
    if (err) return console.log(err);
    console.log(contact);
    res.send(contact);
  });
})
app.post('/send-email', (req, res) => {
  const { recipient, subject, message } = req.body
  letSendMail({ recipient, message, subject, res })
})


process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
})