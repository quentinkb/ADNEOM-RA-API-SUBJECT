const express = require('express')
const app = express()
const fs = require("fs")

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!')
});


app.post('/', function(req, res) {
  var tokenReceived = req.get("X-Auth-Token");
  var authValue = localTokenAuth(tokenReceived);
  var retData ;
  var retCode ;
  if (!authValue) {
    retCode = 403;
    retData = {
      "code":retCode,
      "message":"Votre token n'est pas valide ou est mal renseigné"
    };
  } else {
    var idReceived = req.body.id;
    if (idReceived === undefined || idReceived === "undefined" || idReceived === null) {
      retCode = 400;
      retData = {
        "code":retCode,
        "message":"Un ou plusieurs paramètres sont manquants"
      };
    } else {
      retCode = 200;
      retData = {
        "code":retCode,
        "message":"OK",
      };
    }
  }
  res.status(retCode).send(retData);
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

function localTokenAuth(pToken) {
  if (pToken === undefined || pToken === 'undefined' || pToken === null) {
    return false;
  } else {
    var localAuthToken = readJsonFileSync('parameters.json')["X-Auth-Token"];
    return localAuthToken === pToken;
  }
}

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}
