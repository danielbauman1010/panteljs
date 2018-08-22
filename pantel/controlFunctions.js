const db = require('../controllers/dbController');
const users = require('../controllers/usersController');
const tokens = require('../controllers/tokensController')

var expectingAnswers = {}; //username: function(user,command){}
var collections = {}; //collection: permission

function updateData(user, data){
  return new Promise(function(resolve, reject) {
    users.updateData(user.username,data).then(function(result){
      resolve(result);
    },function(err){
      reject(err);
    });
  });
}

function addListener(user, func){
  return new Promise(function(resolve, reject) {
    expectingAnswers[user.username] = func;
    resolve("Success");
  });
}

function removeListener(user){
  return new Promise(function(resolve, reject) {
    resolve(delete expectingAnswers[user.username]);
  });
}

function hasListener(user){
  return new Promise(function(resolve, reject) {
    resolve(user.username in expectingAnswers);
  });
}

function executeListener(user,command){
  return new Promise(function(resolve, reject) {
    resolve(expectingAnswers[user.username](user,command));
  });
}

function addCollection(collection){
  return new Promise(function(resolve, reject) {
    if(collection in collections){
      reject("Collection already exists.");
    } else {
      const perm = tokens.makeid();
      collections[collection] = perm;
      resolve(perm);
    }
  });
}

function addToCollection(collection, perm, doc){
  return new Promise(function(resolve, reject) {
    if(collections[collection] == perm) {
      db.addToCollection(collection,doc).then(function(result){
        resolve(result);
      },function(err){
        reject(err);
      });
    } else {
      reject("You have no permission to edit this data.");
    }
  });
}

function findInCollection(collection, perm, query){
  return new Promise(function(resolve, reject) {
    if(collections[collection] == perm){
      db.findInCollection(collection,query).then(function(results){
        resolve(results);
      },function(err){
        reject(err);
      })
    } else {
      reject("You have no permission to edit this data.");
    }
  });
}

function update(collection, perm, query, newvals){
  return new Promise(function(resolve, reject) {
    if(collections[collection] == perm){
      db.update(collection,query,newvals).then(function(results){
        resolve(results);
      },function(err){
        reject(err);
      });
    }
  });
}

exports.updateData = updateData;
exports.addListener = addListener;
exports.removeListener = removeListener;
exports.hasListener = hasListener;
exports.executeListener = executeListener;
exports.expectingAnswers = expectingAnswers;
exports.addCollection = addCollection;
exports.addToCollection = addToCollection;
exports.findInCollection = findInCollection;
exports.update = update;
