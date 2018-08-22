const makeid = require('uuid/v4'); //library for generating unique IDs.
var tokens = {}; //Object token: username

function createToken(username){
  return new Promise(function(resolve,reject){
    if(Object.values(tokens).includes(username)) {
      let previousToken = Object.keys(tokens).find(key => {
        tokens[key] == username;
      });
      deleteToken(previousToken).then(function(result){
        if(result){
          let token = makeid();
          tokens[token] = username;
          if(tokens[token] == username) {
            resolve(token);
          } else {
            reject({"message": "Couldn't create Token."});
          }
        } else {
          reject({"message": "Couldn't override previous login."});
        }
      },function(err){
        reject(err);
      });
    } else {
      let token = makeid();
      tokens[token] = username;
      if(tokens[token] == username) {
        resolve(token);
      } else {
        reject({"message": "Couldn't create Token."})
      }
    }
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
  return new Promise(function(resolve,reject){
    if(delete tokens[token]){
      resolve(!(token in tokens));
    } else {
      reject({message: "Couldn\'t log out."});
    }
  });
}

function logout(username){
  return new Promise(function(resolve,reject){
    if(Object.values(tokens).includes(username)){
      let token = Object.keys(tokens).find(key => {
        return tokens[key] == username;
      });
      deleteToken(token).then(function(result){
        if(result){
          resolve("Logged out succesfully.")
        } else {
          resolve("User already logged out.");
        }
      },function(err){
        reject(err);
      });
    } else {
      resolve("User already logged out.");
    }
  });
}

exports.makeid = makeid;
exports.createToken = createToken;
exports.getUsername = getUsername;
exports.deleteToken = deleteToken;
exports.logout = logout;
