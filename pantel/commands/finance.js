const control = require('../controlFunctions');

exports.commands = {
  'set balance': function(user) {
    return new Promise(function(resolve, reject) {
      control.addListener(user, function(user,command){
        return new Promise(function(resolve, reject) {
          control.removeListener(user).then(function(result){
            const balance = Number(command);
            if(isNaN(balance)){
              resolve("Sorry, but you must enter a number.");
            } else {
              control.findInCollection("finance", {"username": user.username}).then(function(results){
                if(results.length>0){

                } else {
                  let userDoc = {};
                  userDoc.username = user.username;
                  userDoc["balance"] = balance;
                  userDoc["purchase history"] = {};
                  userDoc["income histroy"] = {};
                  addToCollection("finance", userDoc).then(function(results){
                    resolve('Balance set, account created.');
                  },function(err){
                    reject(err);
                  });
                }
              },function(err){
                console.log(err);
                reject(err);
              });
            }
          },function(err){
            reject(err);
          })
        });
      }).then(function(result){
        resolve("What is your balance? Please enter a number without a currency, symbols, or letters.");
      },function(err){
        reject(err);
      });
    });
  },
  "show balance": function(user){
    return new Promise(function(resolve, reject) {
      if('finance' in user.data){
        if('balance' in user.data.finance){
          resolve("Balance: "+user.data.finance.balance);
        } else {
          resolve("No balance set. Set balance by typing \"set balance\".");
        }
      } else {
        resolve("No financial record set. Set balance by typing \"set balance\".");
      }
    });
  }
}
