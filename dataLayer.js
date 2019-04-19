var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://adam:manureva0612@cluster0-jiovk.mongodb.net/ApiListe?retryWrites=true";
var client = new MongoClient(uri, {useNewUrlParser :true});
var ObjectId = require('mongodb').ObjectID;
var db;


var dataLayer ={

    init : function(cb){
        client.connect(function(err){
            if(err) throw err;
            db =client.db("ApiListe");
            cb();
        });
    },

    checkUser: function(session,username,password,cb){
        db.collection("user").count({"username": username, "password" : password },function(err, result) {
            if (err) throw err;
            //console.log(result);
            if(result!== 0)
            {
               //you Connected
               console.log("User "+username+" successfuly connected");
               //req.session._id=uuidv1();
               session.username=username;
               //Si je me suis co je lui envoie liste.html
               //console.log("tentative de sendfile")
               cb(200)
            }
            else
               cb(403);
          });
    },

    InsertList: function(liste,username,cb){
        db.collection("listesName").insertOne(liste,function(err,result){
            db.collection("listesName").find({"username":username}).toArray(function(err,docs){

                cb(docs);
            })
        });
    },
    deleteListe: function(listname,username,cb){
        var list = {
            "listname" : listname
        }
        db.collection("listesName").deleteOne(list,function(err,docs){
            db.collection("listesName").find({"username": username}).toArray(function(err,docs){
                cb(docs);
            })
        });
        db.collection("listes").deleteMany(list);
    },

    insertLog : function(log){
        db.collection("user").insertOne(log,function(err,result){});
    },

    getTaskSet : function(username,cb){
        db.collection("listes").find({"username": username}).toArray(function(err,docs){
            cb(docs);
        })
    },

    getTaskFromCollection : function(username, listName, cb) {
        console.log(username);
        console.log(listName);
        db.collection("listes").find({"username": username, "listname" : listName}).toArray(function(err, docs) { //Docs est le résultat de find
            cb(docs);
        });
    },

    getListeName : function(username,cb){   
        db.collection("listesName").find({"username": username}).toArray(function(err, docs) { //Docs est le résultat de find
            cb(docs);
        });
    },


    inserTask : function(task,user,list,cb){
        db.collection("listes").insertOne(task,function(err,result){
            db.collection("listes").find({"username": user, "listname":list}).toArray(function(err,docs){
                cb(docs);
            })  
        });
    },

    delete : function(task,user,list,cb){
        var id = {
            "_id" : ObjectId(task)
        }
        db.collection("listes").deleteOne(id,function(err,result){
            db.collection("listes").find({"username": user, "listname":list}).toArray(function(err,docs){
                cb(docs);
            })
        });
    },

    modifie : function(task,text,username,list,cb){
        console.log("modif datalayer");
        var id = {
            "_id" : ObjectId(task)
        }
        var data = {
            $set:{
                text : text,
                username : username
            }
        }
        db.collection("listes").updateOne(id,data,function(err,result){
            db.collection("listes").find({"username": username, "listname":list}).toArray(function(err,docs){
                cb(docs);
            })
        });
    },

    checked : function(task,d,user,list,cb){
        console.log("test1")
        var id = {
            "_id" : ObjectId(task)
        }
        console.log("test2")
        if(d=="true") var t =false;
        else t=true;
        var data = {
            $set:{
                done : t
            }
        }
        console.log("test3")
        db.collection("listes").updateOne(id,data,function(err,result){
            db.collection("listes").find({"username": user, "listname":list}).toArray(function(err,docs){
                cb(docs);
            })
        });
    }
    

}

module.exports = dataLayer; 