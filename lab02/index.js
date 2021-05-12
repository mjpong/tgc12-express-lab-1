const express = require('express');

let app = express();

app.get('/', function(req,res){
    res.send("<h1>Hello!</h1>")
})

app.get('/hello/:name', function(req,res){
    let name = req.params.name;
    res.send("Hi, " + name);
})

app.listen(3000, function(){
    console.log("Server started")
})