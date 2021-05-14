// include express, hbs and wax-on
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const axios = require('axios');

// 1. create the express app
let app = express();

// 1b. set the view engine
app.set('view engine', 'hbs');

// 1c. set up the wax on
wax.on(hbs.handlebars);

// this is where HBS will look for any file
// that we are extending from
wax.setLayoutPath('./views/layouts')

// enable forms
// ULTRA-IMPORTANT
app.use(express.urlencoded({
    extended: false
}))

const baseURL = "https://petstore.swagger.io/v2";

// ROUTES
app.get('/pets', async function(req,res){
    // same as axios.ge(baseURL + '/pet/findByStatus?status=available)
    let response = await axios.get(baseURL + '/pet/findByStatus', {
        params: {
            'status':'available'
        }
    });
    res.render('pets',{
        'allPets': response.data
    })
})

// display the form
app.get('/pet/create', function(req,res){
    res.render('create_pet')
})

// process the form
app.post('/pet/create', async function(req,res){
    let petName = req.body.petName;
    let category = req.body.petCategory;

    let newPet = {
        "id": Math.floor(Math.random() * 100000 + 10000),
        "category": {
          "id": Math.floor(Math.random() * 1000000 + 100000),
          "name": category
        },
        "name": petName,
        "photoUrls": [
          "n/a"
        ],
        "tags": [
        ],
        "status": "available"
      }

      // save the new pet to the Pet API database
      // later we will replace saving to our own database
      let response = await axios.post(baseURL + "/pet", newPet);
      res.send(response.data);
})

// to display a form that shows the existing pet information
app.get('/pet/:petID/update', async function(req,res){
    // fetch the existing pet information
    let petID = req.params.petID;
    let response = await axios.get(baseURL + '/pet/' + petID);
  
    res.render('edit_pet',{
        'pet': response.data
    })

})

// update the pet (i.e, process the form)

// 3. START SERVER
app.listen(3000, function(){
    console.log("Server has started")
})

