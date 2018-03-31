const express = require('express')
const app = express()
const fs = require("fs")

app.get('/', function (req, res) {
  res.send('Hello World!')
});


app.post('/', function(req, res) {
  var tokenReceived = req.get("X-Auth-Token");
  var authValue = localTokenAuth(tokenReceived);
  console.log(authValue);
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
