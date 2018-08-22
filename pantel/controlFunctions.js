const db = require('../controllers/dbController');
const users = require('../controllers/usersController');
const tokens = require('../controllers/tokensController')

var expectingAnswers = {}; //username: function(user,command){}

function logout(user) {
  return new Promise(function(resolve, reject) {
    tokens.logout(user.username).then(function(result){
      resolve(result);
    },function(err){
      reject(err);
    });
  });
}

function updateData(user, data){
  return new Promise(function(resolve, reject) {
    users.updateData(user.username,data).then(function(result){
      resolve(result);
    },function(err){
      reject(err);
    });
  });
}

function deleteUser(user){
  return new Promise(function(resolve, reject) {
    tokens.logout(user.username).then(function(result){
      users.deleteUser(user.username).then(function(answer){
        resolve(answer);
      }, function(err){
        reject(err);
      })
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

exports.logout = logout;
exports.updateData = updateData;
exports.deleteUser = deleteUser;
exports.addListener = addListener;
exports.removeListener = removeListener;
exports.hasListener = hasListener;
exports.executeListener = executeListener;
exports.expectingAnswers = expectingAnswers;
exports.addToCollection = db.addToCollection;
exports.findInCollection = db.findInCollection;
