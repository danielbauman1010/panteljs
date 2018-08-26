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
  }, "purchase": function(user){
    return new Promise(function(resolve, reject) {
      control.addListener(user,function(user,command){
        return new Promise(function(resolve, reject) {
          let spaceSplit = command.split(' ');
          let amount = Number(spaceSplit.splice(0,1));
          let purchase = spaceSplit.join(' ');
          if(isNaN(amount)){
            resolve("Sorry, but the amount must be a number.");
          } else {
            let query = {};
            query['username'] = user.username;
            control.findInCollection('finance', perm, query).then(function(results){
              if(results.length==0){
                let dataBlock = {};
                dataBlock['username'] = user.username;
                dataBlock['purchase history'] = {};
                dataBlock['balance'] = 0-amount;
                dataBlock['purchase history'][purchase] = amount;
                dataBlock['income history'] = {};
                control.addToCollection('finance', perm, dataBlock);
                resolve('purchase added, account created.');
              } else {
                let user = results[0];
                user['purchase history'][purchase] = amount;
                let dataBlock = {};
                dataBlock['purchase history'] = user['purchase history'];
                let newvals = {};
                newvals['$set'] = dataBlock;
                control.update('finance', perm, query, newvals);
                let balanceBlock = {};
                balanceBlock['balance'] = user.balance - amount;
                let othervals = {};
                othervals['$set'] = balanceBlock;
                control.update('finance',perm,query,othervals);
                resolve("Purchase added.");
              }
            },function(err){
              reject(err);
            });
          }
        });
      });
      resolve("Type the purchase amount, then a space-bar, then the purchase name.");
    });
  }, 'show purchase history': function(user){
    return new Promise(function(resolve, reject) {
      let query = {};
      query['username'] = user.username;
      control.findInCollection('finance', perm, query).then(function(results){
        if(results.length>0){
          let user = results[0];
          if(Object.keys(user['purchase history']).length>0){
            let answer = "";
            for(purchase in user['purchase history']){
              answer += user['purchase history'][purchase];
              answer += " : ";
              answer += purchase;
              answer += '<br>';
            }
            resolve(answer);
          } else {
            resolve("You have no purchase history.");
          }
        } else {
          resolve("You have no financial account.");
        }
      },function(err){
        reject(err);
      });
    });
  }
}
exports.setup = setup;
