//Requirements:
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
const username = 'panteljs';
const password = process.env.mongopass;
const url = 'mongodb://'+username+':'+password+'@pantel-shard-00-00-n4gpm.mongodb.net:27017,pantel-shard-00-01-n4gpm.mongodb.net:27017,pantel-shard-00-02-n4gpm.mongodb.net:27017/test?ssl=true&replicaSet=pantel-shard-0&authSource=admin&retryWrites=true';
const dbname = 'pantel';

function addToCollection(collection, doc) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err,client){
    if(err !== null){
      console.log(err);
    }else{
      var db = client.db(dbname);
      var mongoCollection = db.collection(collection);
      mongoCollection.insertOne(doc, function(err,res){
        client.close();
        if(err){
          console.log(err);
        }
      });
    }
  });
}

function deleteFromCollection(collection, querry) {
    MongoClient.connect(url, function(err, client) {
      if (err !== null) {
        console.log(err);
      }
      let db = client.db(dbname);
      db.collection(collection).remove(querry, function(err, obj) {
        if (err) console.log(err);
        client.close();
      });
    });
}

function getCollection(collection){
  return new Promise(function(resolve,reject) {
    MongoClient.connect(url, function(err,client){
      if(err !== null){
        reject(err);
        console.log(err);
      }else{
        var db = client.db(dbname);
        var mongoCollection = db.collection(collection);
        mongoCollection.find().toArray(function(err,docs){
          client.close();
          if(err) {
            console.log(err);
            reject(err);
          } else {
            resolve(docs);
          }
        });
      }
    });
  });
}

function findInCollection(collection,query){
  return new Promise(function(resolve,reject) {
    MongoClient.connect(url, {useNewUrlParser: true}, function(err,client){
      if(err !== null){
        reject(err);
        console.log(err);
      }else{
        var db = client.db(dbname);
        var mongoCollection = db.collection(collection);
        mongoCollection.find(query).toArray(function(err,docs){
          client.close();
          if(err) {
            console.log(err);
            reject(err);
          } else {
            resolve(docs);
          }
        });
      }
    });
  });
}

function findById(collection,id){
  return new Promise(function(resolve,reject) {
    MongoClient.connect(url, function(err,client){
      if(err !== null){
        reject(err);
        console.log(err);
      }else{
        var db = client.db(dbname);
        var mongoCollection = db.collection(collection);
        mongoCollection.find({_id: ObjectId(id)}).toArray(function(err,docs){
          client.close();
          if(err) {
            console.log(err);
            reject(err);
          } else {
            resolve(docs);
          }
        });
      }
    });
  });
}

function findByName(collection,Name){
  return new Promise(function(resolve,reject) {
    MongoClient.connect(url, function(err,client){
      if(err !== null){
        reject(err);
        console.log(err);
      }else{
        var db = client.db(dbname);
        var mongoCollection = db.collection(collection);
        mongoCollection.find({name: { "$regex": Name}}).toArray(function(err,docs){
          client.close();
          if(err) {
            console.log(err);
            reject(err);
          } else {
            resolve(docs);
          }
        });
      }
    });
  });
}

function update(collection,query,newvals) {
  MongoClient.connect(url, function(err,client){
    if(err !== null){
      console.log(err);
    }else{
      var db = client.db(dbname);
      var mongoCollection = db.collection(collection);
      mongoCollection.updateOne(query,newvals,function(err,res){
        client.close();
        if(err !== null){
          console.log(err);
        }
      })
    }
  });
}

function updateById(collection,id,newvals) {
  MongoClient.connect(url, function(err,client){
    if(err !== null){
      console.log(err);
      console.log(err);
    }else{
      var db = client.db(dbname);
      var mongoCollection = db.collection(collection);
      mongoCollection.updateOne({_id: ObjectId(id)},newvals,function(err,res){
        client.close();
        if(err){
           console.log(err)
        }
      })
    }
  });
}

//exporting all functions:
exports.getCollection = getCollection;
exports.deleteFromCollection = deleteFromCollection;
exports.addToCollection = addToCollection;
exports.findInCollection = findInCollection;
exports.findById = findById;
exports.findByName = findByName;
exports.update = update;
exports.updateById = updateById;
