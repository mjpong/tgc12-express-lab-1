const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
//const dotenv = require ('dotenv');

//transfer all the variables in .env to process.env so that we can refer to it later
require('dotenv').config();

// require in MongoUtil
const MongoUtil= require('./MongoUtil')

async function main() {

    // 1. create the express application
    let app = express();
    
    // 2. set the view engine
    app.set('view engine', 'hbs')
    
    // 3. where to find the public folder
    app.use(express.static('public'))
    
    // 4. set up wax-on
    wax.on(hbs.handlebars);
    wax.setLayoutPath('./views/layouts')
    
    // 5. set up forms
    app.use(express.urlencoded({
        extended: false
    }))
    
    // 6. connect to Mongo
    await MongoUtil.connect(process.env.MONGO_URI, 'food_tracker');
    
    // 7. Define the routes
    
    // root route
    app.get('/', (req,res)=> {
        res.send("Hello World")
    })

    app.get('/food/add',(req, res)=>{
        res.render('add_food.hbs')
    })
    
    app.post('/food/add', (req,res)=>{
        let foodName = req.body.foodName;
        let calories = req.body.calories;
        // test with -> res.send(req.body)

        let db = MongoUtil.getDB();
        db.collection('food').insertOne({
            'foodName': foodName,
            'calories':calories
        });
        res.send("Food Added")
    })
    // 8. start the server
    app.listen(3000, ()=>{
        console.log("Server has started")
    })
    }
    
    main();