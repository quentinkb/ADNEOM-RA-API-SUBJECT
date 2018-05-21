const express = require('express')
const app = express()
const fs = require("fs")
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000
const { Client } = require('pg');


var ip = require("ip");



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var addColumn = "ALTER TABLE access ADD ip_address varchar(255)";

var client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect().catch(function (result){
  console.log(result);
});

client.query(addColumn, (err, res) => {
  if (err) throw err;
  console.log(res);
  client.end();
});


/**
 * récupération du token
 * @table access
 * chaque appel à la route produit une insertion en base
 * database : herokuPostGre
 */
app.post('/', function(req, res) {
  var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  var SQLRequest = "INSERT INTO access (id_user, last_name, first_name, access_time, success, code, message) VALUES (";
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
    SQLRequest += "-1, null, null, '"+date+"', 0, '403', 'wrong_token');";
  } else {
    var idReceived = parseInt(req.body.Id);
    if (idReceived === undefined || idReceived === "undefined" || idReceived === null || isNaN(idReceived)) {
      retCode = 400;
      retData = {
        "code":retCode,
        "message":"Un ou plusieurs paramètres sont manquants ou malformés"
      };
      SQLRequest += "-1, null, null, '"+date+"', 0, '400', 'missing_parameters');";
    } else {
      var localUsers = readJsonFileSync('users.json');
      if (localUsers === 'undefined' || localUsers === undefined || localUsers === null || localUsers.users === 'undefined' || localUsers.users === undefined || localUsers.users === null ||(localUsers.users.length == 0)) {
        retCode = 500 ;
        retData = {
          "code":retCode,
          "message":"[Erreur technique] - la base de données utilisateurs n'est pas joignable"
        }
        SQLRequest += "-1, null, null, '"+date+"', 0, '500', 'internal_error');";
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
          SQLRequest += "-1, null, null, '"+date+"', 0, '404', 'user_not_found');";
        } else {
          retCode = 200;
          retData = {
            "code":retCode,
            "message":"Bravo, voici les informations nécessaires pour la suite du test.",
            "user":currentUser,
            "resources": localConfig.resources
          };
          SQLRequest += currentUser.id+", '" + currentUser.lastName + "', '" + currentUser.firstName + "', '"+date+"', 1, '200', 'success');";
        }
      }
    }
  }

  console.log(SQLRequest);
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect().catch(function (result){
    console.log(result);
  });

  client.query(SQLRequest, (err, res) => {
    if (err) throw err;
    console.log(res);
    client.end();
  });

  res.status(retCode).send(retData);
});

app.get('/getaccess',function (req, iRes) {
  console.log("get access");
  var SQLRequest = "SELECT * FROM access";
  var rows = null;
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect().catch(function (result){
    console.log(result);
  });
  client.query(SQLRequest, (err, res) => {
    client.end();
    // CORS headers
    iRes.header("Access-Control-Allow-Origin", "YOUR_URL"); // restrict it to the required domain
    iRes.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    // Set custom headers for CORS
    iRes.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
    if (req.method === "OPTIONS") {
        return iRes.status(200).end();
    }
    iRes.status(200)
    iRes.jsonp(res.rows);
  });
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


function getiPAdress() {

}
