/** Appel des dépendances et des packages externes */
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var router = require('./api-route.js');
var dataLayer = require('./dataLayer.js');
var bodyParser = require('body-parser');

var app =express();

app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json({ type : 'application/vnd.api+json' })); //type de l'application
app.use(express.static(__dirname));
app.use(session({secret: "Shh, its a secret!"}));
app.use(session({
    name :"Cookiee AppMob"
 }));

app.use(router);

dataLayer.init(function(){
    app.listen(process.env.PORT || 8080);
    console.log("on utilise le port 8080");
})



