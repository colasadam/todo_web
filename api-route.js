var dataLayer = require('./dataLayer.js');
var express = require('express');

var app = require('express').Router();;
var bodyParser = require('body-parser');

var cors = require('cors');

var userconnected;

app.use(cors({origin: 'https://todo-adam-colas-mobile.herokuapp.com'}));

app.get('/', function(req, res) {
    console.log("test");
    res.sendFile(__dirname + '/connexion.html');;
});


app.post('/login/:username/:password', function(req, res){
    dataLayer.checkUser(req.session,req.params.username,req.params.password,function(codeEchange){
        userconnected = req.params.username;
        res.setHeader('Access-Control-Allow-Origin', 'https://todo-adam-colas-mobile.herokuapp.com');
        res.sendStatus(codeEchange);
    });
});

app.post('/cree/:username/:password', function(req, res){
    var log ={
        username : req.params.username,
        password : req.params.password
    }
    dataLayer.insertLog(log, function(listeUser){
    });
});

app.post('/ListeCreate/:listname', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://todo-adam-colas-mobile.herokuapp.com');
    if(req.body){
        if(req.session.username !== undefined || userconnected !== undefined){
            var today = new Date();
            var weekday = new Array(7);
            weekday[0] = "Dimanche";
            weekday[1] = "Lundi";
            weekday[2] = "Mardi";
            weekday[3] = "Mercredi";
            weekday[4] = "Jeudi";
            weekday[5] = "Vendredi";
            weekday[6] = "Samedi";

            var n = weekday[today.getDay()];
            var dd = today.getDate();
        
            var month = new Array(7);
            month[0] = "Decembre";
            month[1] = "Janvier";
            month[2] = "Fevrier";
            month[3] = "Mars";
            month[4] = "Avril";
            month[5] = "Mai";
            month[6] = "Juin";
            month[7] = "Juillet";
            month[8] = "Aout";
            month[9] = "Septembre";
            month[10] = "Octobre";
            month[11] = "Novembre";
            var mm = month[today.getMonth()+1]; 

            var yyyy = today.getFullYear();
                var task ={
                    text : req.body.text,
                    date : n+' '+dd+' '+mm+' '+yyyy,
                    username : userconnected,
                    done : false,
                    listname : req.params.listname
                };

            dataLayer.inserTask(task, userconnected, req.params.listname,function(listeUser){
                res.json(listeUser);
            });
        }
        else {
            res.sendStatus(403);
        }
    }else{
        res.send({
            success : false,
            errorCode : "PARAM_MISSING"
        })
    }

});

app.post('/Liste/delete/:liste_id/:listname', function(req,res){
    res.setHeader('Access-Control-Allow-Origin', 'https://todo-adam-colas-mobile.herokuapp.com');
    console.log("delete dans la liste")
    console.log(req.params.listname);
    console.log("username")
    console.log(userconnected);
    dataLayer.delete(req.params.liste_id,userconnected,req.params.listname,function(maliste){
        res.json(maliste);
    })
});

app.post('/CreateList/',function(req,res){
    var liste={
        listname : req.body.text,
        username : userconnected
    }
    dataLayer.InsertList(liste,userconnected,function(maliste){
        res.json(maliste);
    })
})

app.post('/DeleteList/:listname',function(req,res){
    console.log(req.params.listname);
    res.setHeader('Access-Control-Allow-Origin', 'https://todo-adam-colas-mobile.herokuapp.com');
    dataLayer.deleteListe(req.params.listname,userconnected,function(maliste){
        res.json(maliste);
    })
});

app.put('/Liste/:liste_id/:done/:list', function(req,res){
    console.log("test modif")
    console.log(userconnected);
    console.log(req.params.liste_id);
    console.log(req.params.done);
    console.log(req.params.list);
    if(req.session.username !== undefined || userconnected !== undefined){
        dataLayer.checked(req.params.liste_id,req.params.done,userconnected,req.params.list,function(maliste){
            res.json(maliste);
        });
    }
    else{
        res.send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }
    
});

app.post('/Liste/modify/:liste_id/:text/:list', function(req,res){
    console.log("test modif");
    if(req.session.username !== undefined || userconnected !== undefined){
        dataLayer.modifie(req.params.liste_id,req.params.text,userconnected,req.params.list,function(maliste){
            res.json(maliste);
        });
    }
    else{
        res.send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }   
});

app.get("/Listetache/:listname",function(req,res){
    console.log("test liste");
    res.setHeader('Access-Control-Allow-Origin', 'https://todo-adam-colas-mobile.herokuapp.com');
    if(req.session.username !== undefined ||userconnected!==undefined)
    {
            dataLayer.getTaskFromCollection(userconnected,req.params.listname,function(maliste) { 
                res.json(maliste);
            });
        
    }
    else{
        res.sendStatus(403);
    }
})

app.get("/ListeUser", function(req,res){
    console.log("Je suis dans listeUser")
    //console.log(req.session);
    if(req.session.username !== undefined)
    {
     dataLayer.getTaskSet(req.session.username, function(maliste) { 
          res.json(maliste);
      });
    }
    else{
        res.sendStatus(403);
    }
});

app.get("/DiffListe/:listname",function(req,res){
    console.log("Je suis dans DiffListe");
    res.setHeader('Access-Control-Allow-Origin', 'https://todo-adam-colas-mobile.herokuapp.com');
    if(req.session.username !== undefined ||userconnected!== undefined)
    {
        console.log("testdiffListe");
        dataLayer.getListeName(userconnected,function(maliste) { 
        console.log(maliste);
        res.json(maliste);
        });
    }
    else{
        res.sendStatus(403);
    }
})


app.get("/AfficheListe", function(req,res){
    console.log("Je suis dans AfficheListe")
    if(req.session.username !== undefined || userconnected!== undefined)
       res.sendFile(__dirname + '/public/index.html');
     else
       res.sendStatus(403);
});

app.post("/Deconnexion",function(req, res){
    req.session.destroy();
    console.log(req.session);
    res.send(req.session);
    res.redirect("/");
});

module.exports=app;