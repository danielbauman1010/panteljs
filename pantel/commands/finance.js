const control = require('../controlFunctions');

var perm = "";
function setup(){
  control.addCollection("finance").then(function(permN){
    perm = permN;
  },function(err){
    console.log(err);
  });
}

exports.commands = {
  'set balance': function(user) {
    return new Promise(function(resolve, reject) {
      control.addListener(user, function(user,command){
        return new Promise(function(resolve, reject) {
            const balance = Number(command);
            if(isNaN(balance)){
              resolve("Sorry, but you must enter a number.");
            } else {
              let query = {};
              query['username'] = user.username
              control.findInCollection("finance", perm, query).then(function(results){
                if(results.length>0){
                  let dataBlock = {};
                  dataBlock['balance'] = balance;
                  let newvals = {};
                  newvals['$set'] = dataBlock;
                  control.update('finance', perm, query, newvals);
                  resolve('Balance set to '+balance);
                } else {
                  let userDoc = {};
                  userDoc.username = user.username;
                  userDoc["balance"] = balance;
                  userDoc["purchase history"] = {};
                  userDoc["income histroy"] = {};
                  control.addToCollection("finance", perm, userDoc);
                  resolve('Balance set, account created.');
                }
              },function(err){
                console.log(err);
                reject(err);
              });
            }
          });
      });
      resolve("What is your balance? Please enter a number without a currency, symbols, or letters.");
    });
  },
  "show balance": function(user){
    return new Promise(function(resolve, reject) {
      let query = {};
      query['username'] = user.username;
      control.findInCollection('finance', perm, query).then(function(results){
        if(results.length==0){
          resolve("You have no balance set.");
        } else {
          let account = results[0];
          resolve(account['balance']);
        }
      },function(err){
        reject(err);
      });
    });
  }
}
exports.setup = setup;
