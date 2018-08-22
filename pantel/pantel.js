const control = require('./controlFunctions');
const fs = require('fs');
const path = require('path');

function executeCommand(user,command){
  return new Promise(function(resolve,reject){
    if(user.username in control.expectingAnswers){
      control.executeListener(user,command).then(function(answer){
        resolve(answer);
      },function(err){
        reject(err);
      });
    } else if(command.toLowerCase() in commands){
      commands[command.toLowerCase()](user).then(function(answer){
        resolve(answer);
      },function(err){
        reject(err);
      });
    } else {
      resolve("Sorry "+user.username+", the command "+command+" couldn\'t be processed yet.");
    }
  });
}

var commands = {}; //commandString: function(user){}

function loadCommands() {
  commands["logout"] = function(user){
    return new Promise(function(resolve,reject){
      control.logout(user).then(function(result){
        resolve(result);
      },function(err){
        reject(err);
      });
    });
  }

  commands["delete user"] = function(user){
    return new Promise(function(resolve, reject) {
      control.deleteUser(user).then(function(result){
        resolve(result);
      }, function(err){
        reject(err);
      })
    });
  }

  fs.readdir(path.join(__dirname,"commands"), function(err, files){
    files.forEach(f => {
      var file = require("./commands/"+f.slice(0,f.length-3));
      Object.keys(file.commands).forEach(command => {
        commands[command] = file.commands[command];
      });
    });
  });
}
loadCommands();
exports.executeCommand = executeCommand;
