// Requirements:
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../controllers/dbController');
const users = require('../controllers/usersController');
const pantel = require('../pantel/pantel');
const ui = require('./interface');
const tokens = require('../controllers/tokensController');
//verbose mode - use for debugging
var verbose = false;

//verbose check:
if (process.argv.length>2) {
  verbose = process.argv[2] === "-v" || process.argv[2] === "-verbose";
}

//verbose printouts:
function vprint(s) {
  if(verbose){
    console.log(s);
  }
}

//initializing server
const server = express();
vprint("Initializing server");

server.use(express.static(path.join(__dirname,"../public")));
vprint("Serving static files");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
}));

server.post('/signup',function(req,res){
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  vprint("Signing up user {"+email+", "+username+", "+password+"}");
  users.createUser(username,password,email).then(function(result){
    res.end(result);
  },function(err){
    vprint(err);
    res.end("<!DOCTYPE html><html>"+err.message+" <a href=\"/\">Back</a></html>");
  })
});

server.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  vprint("Logging in user {"+username+"}");
  users.login(username,password).then(function(token){
    vprint("Logged in "+username);
    res.end(ui.preToken+token+ui.postToken+"Welcome to pantel, type a command. For help, type help. To logout, type logout."+ui.postAnswer);
  },function(err){
    vprint(err);
    res.end("<!DOCTYPE html><html>"+err.message+" <a href=\"/\">Back</a></html>");
  })
});

server.post('/command', function(req,res){
  const token = req.body.token;
  const command = req.body.command;
  tokens.getUsername(token).then(function(username){
    let query = {};
    query['username'] = username;
    users.getUser(query).then(function(user){
      pantel.executeCommand(user,command).then(function(answer){
      res.end(ui.preToken+token+ui.postToken+answer+ui.postAnswer);
      },function(err){
        vprint(err);
        res.end("<!DOCTYPE html><html>"+err.message+" <a href=\"/\">Back</a></html>");
      });
    },function(err){
      vprint(err);
      res.end("<!DOCTYPE html><html>"+err.message+" <a href=\"/\">Back</a></html>");
    });
  },function(err){
    vprint(err);
    res.end("<!DOCTYPE html><html>"+err.message+" <a href=\"/\">Back</a></html>");
  });
});

server.listen(3000);
console.log("Listening on\nhttp://localhost:3000/");
