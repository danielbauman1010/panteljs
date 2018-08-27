const db = require('../controllers/dbController');
const users = require('../controllers/usersController');
const tokens = require('../controllers/tokensController')

var expectingAnswers = {}; //username: function(user,command){}
var collections = {}; //collection: permission

function updateData(user, data){
  users.updateData(user.username,data);
}

function addListener(user, func){
  expectingAnswers[user.username] = func;
}

function removeListener(user){
  delete expectingAnswers[user.username];
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
  if(collections[collection] == perm) {
    db.addToCollection(collection,doc);
  }
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
  if(collections[collection] == perm){
    db.update(collection,query,newvals);
  }
}

function deleteFromCollection(collection, perm, query){
  if(collections[collection] == perm){
    db.deleteFromCollection(collection, query);
  }
}

exports.updateData = updateData;
exports.addListener = addListener;
exports.removeListener = removeListener;
exports.executeListener = executeListener;
exports.expectingAnswers = expectingAnswers;
exports.addCollection = addCollection;
exports.addToCollection = addToCollection;
exports.findInCollection = findInCollection;
exports.update = update;
exports.deleteFromCollection = deleteFromCollection;
