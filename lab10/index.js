// CREATE OWN API

// SETUP EXPRESS
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const MongoUtil = require('./MongoUtil')

let app = express();

// enable JSON as the transfer data format
// !!ULTRA IMPORTANT!!
app.use(express.json());

// enable CORS 
app.use(cors())

async function main() {
    let db = await MongoUtil.connect(process.env.MONGO_URI, "food_sightings")

    // questions to ask ourselves
    // 1. WHAT is the purpose of the API
    // - Create new information
    // - Read existing information
    // - Update existing information
    // - Delete existing information

    // 2. WHAT is the DATA needed?
    // eg. to show all the possbile free food listing ==> no data from client
    // eg. show all food listing between a start date and end date ==> need start date and end date from client
    // and 2B - what is the JSON format

    // 3. WHAT is the DATA that we (as in the API) send back to the client
    // C ==> send back the object or document that is newly created
    // R ==> send back the documents that matches the critera (if any is given)
    // U ==> send back the document that is updated
    // D ==> send back the document that is deleted

    // ENDPOINT: Add a new free food sighting to the database
    // When we CREATE, we always use the POST method
    app.post("/free_food_sighting", async (req, res) => {
        // we need: the type of food, location, date
        // We expect the client to send us a JSON object in the following format:
        // {
        // "location":"LT 2",
        // "food":"Western food",
        // "date": "2020-01-01"  // must be YYYY-MM-DD
        //}
        try {
            let location = req.body.location;
            let food = req.body.food;
            let date = req.body.date;
            let db = MongoUtil.getDB();
            let result = await db.collection('food').insertOne({
                'food': food,
                'location': location,
                'date': new Date(date)  // to create an ISO Date Object from a string
            })
            res.send(result);

            // send back the status (HTTP code)
            res.status(200);
        } catch (e) {
            res.send("Unexpected internal server error");
            res.status(500);
            console.log(e)
        }
    })

    app.get('/free_food_sighting', async (req,res)=>{

        let food = req.query.search;

        let critera = {};

        // null ==> false
        // undefined ==> false
        // "" ==> false
        if (food) {
            // if food is not null and not undefined and not empty string
            // add it to the critera 
            critera['food'] = {
                '$regex': food,
                '$options': 'i'
            }
        }

        // fetch all the food sightings and send back
        let db = MongoUtil.getDB();
        let results = await db.collection('food').find(critera).toArray();
        // let say req.query.food is "chicken", then it is e.q.v to writing:
        // db.collection('food').find(
        // "food": {
        //    "$regex":"chicken", "$options":"i"
        //}
        // )
        res.send(results);
        res.status(200);
    })

    app.put('/free_food_sighting/:id', async(req,res)=>{
        // retrieve the client's data
        let food = req.body.food;
        let location = req.body.location;
        let date = new Date(req.body.date);

        let db = MongoUtil.getDB();
        let results = await db.collection('food').updateOne({
            "_id": ObjectId(req.params.id)
        },{
            "$set": {
                "food": food,
                "location": location,
                "date":date
            }
        })
        res.status(200)
        res.send(results);
    })
}

main()

app.listen(3000, () => {
    console.log("server started")
})