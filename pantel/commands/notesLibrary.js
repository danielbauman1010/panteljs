const control = require('../controlFunctions');
var perm = "";
function setup(){
  control.addCollection("notes").then(function(result){
    perm = result;
  },function(err){
    console.log("Notes library unable to get permission for collection.\n"+err);
  })
}
const commands = {
  "note" : function(user) {
    return new Promise(function(resolve,reject){
      control.addListener(user,function(user,command){
        return new Promise(function(resolve,reject){
          let query = {};
          query['username'] = user.username;
          control.findInCollection("notes", perm, query).then(function(results){
            if(results.length>0){
              let userData = results[0];
              userData.notes.push(command);
              let change = {};
              change['notes'] = userData.notes;
              let newvals = {};
              newvals['$set'] = change;
              control.update('notes', perm, query, newvals);
              resolve("Dully noted.");
            } else {
              let userData = {};
              userData['username'] = user.username;
              userData['notes'] = [];
              userData['notes'].push(command);
              control.addToCollection("notes", perm, userData);
              resolve("Dully noted.");
            }
          },function(err){
            reject(err);
          });
        });
      });
      resolve("What would you like to note?");
    });
  }, "show notes" : function(user){
    return new Promise(function(resolve,reject){
      let query = {};
      query['username'] = user.username;
      control.findInCollection("notes", perm, query).then(function(results){
        if(results.length==0){
          resolve("I have no record of you taking any notes.");
        } else {
          let userData = results[0];
          if(userData.notes.length==0){
            resolve("You have no notes.");
          } else {
            let answer = "";
            for(index in userData.notes){
              answer += userData.notes[index];
              answer += "<br>";
            }
            resolve(answer);
          }
        }
      },function(err){
        reject(err);
      })
    });
  }, "delete note" : function(user){
    return new Promise(function(resolve,reject){
      control.addListener(user, function(user,command){
        return new Promise(function(resolve,reject){
          let query = {};
          query['username'] = user.username;
          control.findInCollection("notes", perm, query).then(function(results){
            if(results.length == 0){
              reject("You never took a note.");
            } else {
              let data = results[0];
              let note = data.notes.find(n => {
                return n.includes(command);
              });
              if(note !== null && note !== undefined) {
                data.notes = data.notes.sort(n => n !== note);
                data.notes.splice(0,1);
                let dataQuery = {};
                dataQuery.notes = data.notes;
                let newvals = {};
                newvals['$set'] = dataQuery;
                control.update("notes", perm, query, newvals);
                resolve("Deleted.");
              } else {
                resolve("Sorry, couldn\'t find your note.");
              }
            }
          },function(err){
            reject(err);
          });
        });
      });
      resolve("Write a quote from that note please.");
    });
  }, "delete notes": function(user){
    return new Promise(function(resolve, reject) {
      let query = {};
      query['username'] = user.username;
      control.deleteFromCollection('notes', perm, query);
      resolve('deleted.');
    });
  }
}

exports.commands = commands;
exports.setup = setup;
