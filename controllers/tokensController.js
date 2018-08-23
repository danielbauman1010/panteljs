const makeid = require('uuid/v4'); //library for generating unique IDs.
var tokens = {}; //Object token: username

function createToken(username){
  return new Promise(function(resolve,reject){
    if(Object.values(tokens).includes(username)) {
      let previousToken = Object.keys(tokens).find(key => {
        tokens[key] == username;
      });
      deleteToken(previousToken);
    }
    let token = makeid();
    tokens[token] = username;
    resolve(token);
  });
}

function getUsername(token) {
  return new Promise(function(resolve,reject){
    if(token in tokens){
      resolve(tokens[token]);
    } else {
      reject({"message": "Invalid login access token. Please login again."});
    }
  });
}

function deleteToken(token) {
  delete tokens[token];
}

function logout(username){
  if(Object.values(tokens).includes(username)){
    let token = Object.keys(tokens).find(key => {
      return tokens[key] == username;
    });
    deleteToken(token);
  }
}

exports.makeid = makeid;
exports.createToken = createToken;
exports.getUsername = getUsername;
exports.deleteToken = deleteToken;
exports.logout = logout;
