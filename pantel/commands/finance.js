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
              findInCollection()
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
