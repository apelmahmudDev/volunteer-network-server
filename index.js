const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
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

    // INSERT EVENT IN THE DATABASE
    app.post('/addEvent', (req, res) => {
        const event = req.body;
        vOptionCollection.insertOne(event)
        .then(result => {
            res.send(result);
            console.log('Data inserted successfully')
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

    // LOAD A MATCHING VOLUNTEER BY ID
    app.get('/volunteer/:id', (req, res) => {
        vOptionCollection.find({id: req.params.id})
        .toArray((error, documents) => {
            res.send(documents[0])
        })
    })

    // GET SPEACIFIC VOLUNTEER
    app.get('/volunteer', (req, res) => {
        volunteerCollection.find({email: req.query.email})
        .toArray((error, documents) => {
            res.send(documents)
        })
    })

    // LOAD VOLUNTEERS FOR ADMIN LIST
    app.get('/volunteers', (req, res) => {
        volunteerCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    // DELETE VOLUNTEER FROM ACTIVITIES AND ANDMIN LIST
    app.delete('/deleteVolunteer/:id', (req, res) => {
        volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) => {
            res.send(result.deletedCount > 0);
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