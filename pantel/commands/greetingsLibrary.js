const control = require('../controlFunctions');

var commands = {
  "hello": function(user) {
    return new Promise(function(resolve,reject){
      resolve("Hi there, "+user.username+".");
    });
  }
}

const greetings = ["hi","yo","howdy","greetings","hey","sup"];
greetings.forEach(greeting => {
  commands[greeting] = commands["hello"];
});

exports.commands = commands;
