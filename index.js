const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clbh1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
    const vOptionCollection = client.db(`${process.env.DB_NAME}`).collection("vOptions");
    const volunteerCollection = client.db(`${process.env.DB_NAME}`).collection("volunteer");

    app.post('/addVoptions', (req, res) => {
        const volunteerOptions = req.body;
        vOptionCollection.insertMany(volunteerOptions)
        .then(result => {
            res.send(result);
            console.log('Data insted into database')
        })
    })

    app.post('/addVolunteer', (req, res) => {
        volunteerCollection.insertOne(req.body)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/loadVoptions', (req, res) => {
        vOptionCollection.find({})
        .toArray((error, documents) => {
            res.send(documents)
        })
    })

    app.get('/volunteer/:id', (req, res) => {
        vOptionCollection.find({id: req.params.id})
        .toArray((error, documents) => {
            res.send(documents[0])
        })
    })

    app.get('/volunteer', (req, res) => {
        volunteerCollection.find({email: req.query.email})
        .toArray((error, documents) => {
            res.send(documents)
            console.log('volunteer is came')
        })
    })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('Backend server running!')
})

app.listen(process.env.DB_PORT, () => {
  console.log(`app listening at http://localhost:${process.env.DB_PORT}`)
})