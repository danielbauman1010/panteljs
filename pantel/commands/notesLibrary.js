const control = require('../controlFunctions');

const commands = {
  "note" : function(user) {
    return new Promise(function(resolve,reject){
      control.addListener(user,function(user,command){
        return new Promise(function(resolve,reject){
          control.removeListener(user).then(function(result){
            let query = {};
            query['username'] = user.username;
            control.findInCollection(notes,query).then(function(results){
              let notes = [];
              if(results.length > 0){
                notes = results[0][user.username];
              }
              notes.push(command);
              
            },function(err){
              reject(err);
            });
          },function(err){
            reject(err);
          });
        });
      }).then(function(result){
        resolve("What would you like to note?");
      },function(err){
        reject(err);
      });
    });
  }, "show notes" : function(user){
    return new Promise(function(resolve,reject){
      if("notes" in user.data){
        let answer = "";
        user.data.notes.forEach(n => {
          answer += n+"<br>";
        });
        resolve(answer);
      } else {
        resolve("Sorry, no notes noted.");
      }
    });
  }, "delete note" : function(user){
    return new Promise(function(resolve,reject){
      control.addListener(user, function(user,command){
        return new Promise(function(resolve,reject){
          control.removeListener(user).then(function(result){
            let data = user.data;
            if("notes" in data) {
              let note = data.notes.find(n => {
                return n.includes(command);
              });
              if(note !== null && note !== undefined) {
                data.notes = data.notes.sort(n => n !== note);
                data.notes.splice(0,1);
                let dataQuery = {};
                dataQuery.data = data;
                control.updateData(user,dataQuery).then(function(result){
                  resolve("Deleted.");
                },function(err){
                  reject(err);
                });
              } else {
                resolve("Sorry, couldn\'t find your note.");
              }
            } else {
              resolve("You have no notes.");
            }
          },function(err){
            reject(err);
          });
        });
      }).then(function(result){
        resolve("Write a quote from that note please.");
      },function(err){
        reject(err);
      });
    });
  }
}

exports.commands = commands;
