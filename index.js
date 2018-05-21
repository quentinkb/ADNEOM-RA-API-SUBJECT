const express = require('express')
const app = express()
const fs = require("fs")
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

var createTableString = "INSERT INTO utilisateur (nom, prenom) VALUES ('BERNET','QUENTIN')";

client.connect().catch(function (result){
  console.log(result);
});

client.query(createTableString, (err, res) => {
  if (err) throw err;
  console.log(res);
  client.end();
});



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.post('/', function(req, res) {
  var tokenReceived = req.get("X-Auth-Token");
  var localConfig = readJsonFileSync('parameters.json');
  var authValue = localTokenAuth(tokenReceived, localConfig.XAuthToken);
  var retData ;
  var retCode ;
  if (!authValue) {
    retCode = 403;
    retData = {
      "code":retCode,
      "message":"Votre token n'est pas valide ou est mal renseigné"
    };
  } else {
    var idReceived = parseInt(req.body.Id);
    if (idReceived === undefined || idReceived === "undefined" || idReceived === null || isNaN(idReceived)) {
      retCode = 400;
      retData = {
        "code":retCode,
        "message":"Un ou plusieurs paramètres sont manquants ou malformés"
      };
    } else {
      var localUsers = readJsonFileSync('users.json');
      if (localUsers === 'undefined' || localUsers === undefined || localUsers === null || localUsers.users === 'undefined' || localUsers.users === undefined || localUsers.users === null ||(localUsers.users.length == 0)) {
        retCode = 500 ;
        retData = {
          "code":retCode,
          "message":"[Erreur technique] - la base de données utilisateurs n'est pas joignable"
        }
      } else {
        localUsers = localUsers.users;
        var currentUser = null;
        localUsers.forEach( function (user) {
          if (user.id === idReceived) {
            currentUser = user;
          }
        });
        if (currentUser === null) {
          retCode = 404;
          retData = {
            "code":retCode,
            "message": "[Utilisateurs manquant] - vous n'êtes pas encore réferencé dans nos bases."
          };
        } else {
          retCode = 200;
          retData = {
            "code":retCode,
            "message":"Bravo, voici les informations nécessaires pour la suite du test.",
            "user":currentUser,
            "resources": localConfig.resources
          };
        }
      }
    }
  }
  res.status(retCode).send(retData);
});

app.get('/blackmirror', function (req, res) {
  var tokenReceived = req.get("X-Auth-Token");
  var localConfig = readJsonFileSync('parameters.json');
  var authValue = localTokenAuth(tokenReceived, localConfig.resources.api.headers[0].value);
  var retCode;
  var retData;
  if (!authValue) {
    retCode = 403;
    retData = {
      "code":retCode,
      "message":"Votre token n'est pas valide ou est mal renseigné"
    };
  } else {
    retCode = 200;
    retData = {
      "code":retCode,
      "message":"Success",
      "resources":readJsonFileSync('blackmirror.json')
    };
  }
  res.status(retCode).send(retData);
});

app.listen(PORT, function () {
  console.log('API RA API SUBJECT listening on port ' + PORT)
});

function localTokenAuth(pToken, lToken) {
  if (pToken === undefined || pToken === 'undefined' || pToken === null) {
    return false;
  } else {
    var localAuthToken = lToken;
    return localAuthToken === pToken;
  }
}

function readJsonFileSync(filepath, encoding)
{
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}
