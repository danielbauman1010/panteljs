const db = require('./dbController');
const tokens = require('./tokensController');
const bcrypt = require('bcrypt');
/*
User object:
{
  "username": "<username>",
  "password": "<password>",
  "email":  "<email>",
  "_id":  "<mongo generated ObjectID string>",
  "commands": {
                "<Command name>": ["<set>", "<of>", "<actions>"]
              },
  "data": {"<personal data field>": "<proper personal data value>"}
}
*/


function createUser(username,password,email){
  return new Promise(function(resolve,reject){
    let usernameObj = {};
    usernameObj['username'] = username;
    let emailObj = {};
    emailObj['email'] = email;
    userExists(usernameObj).then(function(usernameTaken){
      if(usernameTaken) {
        reject({message: "This username is taken."});
      } else {
        userExists(emailObj).then(function(emailTaken){
          if(emailTaken){
            reject({message: "This email is taken."});
          } else {
            let userObj = {};
            userObj["username"] = username;
            userObj["email"] = email;
            userObj["commands"] = {};
            userObj["data"] = {};
            let hashstr = username + "|" + password;
            bcrypt.hash(hashstr, 10, function(err, hash){
              if(err){
                reject(err);
              } else {
                userObj["password"] = hash;
                db.addToCollection('users',userObj).then(function(result){
                  resolve("<!DOCTYPE html><html>User created. <a href=\"/\">Back</a></html>");
                },function(err){
                  reject(err);
                });
              }
            });
          }
        },function(err){
          reject(err);
        });
      }
    },function(err){
      reject(err);
    });
  });
}

function userExists(query) {
  return new Promise(function(resolve,reject){
    db.findInCollection('users',query).then(function(results){
      resolve(results.length>0);
    },function(err){
      reject(err);
    });
  });
}

function login(username,password){
  return new Promise(function(resolve,reject){
    let usernameObj = {};
    usernameObj['username'] = username;
    db.findInCollection('users',usernameObj).then(function(results){
      if(results.length>0){
        let user = results[0];
        let hashstr = username+"|"+password;
        bcrypt.compare(hashstr,user.password,function(err, res){
          if(err){
            reject(err);
          } else {
            if(res) {
              tokens.createToken(user.username).then(function(token){
                resolve(token);
              },function(err){
                reject(err);
              });
            } else {
              reject({message:"Incorrect username or password."});
            }
          }
        });
      } else {
        reject({message: "Username does not exist."});
      }
    },function(err){
      reject(err);
    });
  });
}

function getUser(query){
  return new Promise(function(resolve,reject){
    db.findInCollection('users',query).then(function(results){
      if(results.length>0){
        let user = results[0];
        resolve(user);
      } else {
        reject({message: "User not found."});
      }
    },function(err){
      reject(err);
    });
  });
}

function updateData(username,data){
  return new Promise(function(resolve, reject) {
    let query = {};
    query.username = username;
    let newData = {};
    newData["$set"] = data;
    db.update('users',query, newData).then(function(result){
      resolve(result);
    },function(err){
      reject(err);
    });
  });
}

function deleteUser(username){
  return new Promise(function(resolve, reject) {
    let query = {};
    query.username = username;
    db.deleteFromCollection('users',query).then(function(result){
      resolve(result);
    },function(err){
      reject(err);
    });
  });
}

exports.createUser = createUser;
exports.login = login;
exports.userExists = userExists;
exports.getUser = getUser;
exports.updateData = updateData;
exports.deleteUser = deleteUser;
