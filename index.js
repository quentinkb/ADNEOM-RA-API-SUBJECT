const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000

const DataChecker = require('./DataChecker');
const dataChecker = new DataChecker()

const MessageManager = require('./MessageManager')
const messageManager = new MessageManager()

const APIResponseManager = require('./APIResponseManager')
const apiResponseManager = new APIResponseManager()

const FileAccess = require('./FileAccess')
const fileAccess = new FileAccess()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(PORT, function () {
  console.log('API RA API SUBJECT listening on port ' + PORT)
});


app.get('/php-test-technique/subject', (req, res) => {
  
  const tokenReceived = req.get("X-Auth-Token")
  const localConfig = fileAccess.readJsonFileSync('parameters.json')

  if (!dataChecker.isTokenValid(tokenReceived, localConfig.XAuthToken))
    return apiResponseManager.returnAPI(res, 403, messageManager.getWrongTokenMessage())

  const idReceivedFromRequest = parseInt(req.body.Id)
  if (dataChecker.idIsIncorrect(idReceivedFromRequest))
    return apiResponseManager.returnAPI(res, 400, messageManager.getMissignParamsMessage())
  
  let localUsers = fileAccess.readJsonFileSync('users.json')
  if (dataChecker.userDataBaseUnreachable(localUsers))
    return apiResponseManager.returnAPI(res, 500, messageManager.getTechnicalErrorMessage())
  
  const currentUser = dataChecker.findUser(localUsers.users, idReceivedFromRequest);
  if (dataChecker.userNotFound(currentUser))
    return apiResponseManager.returnAPI(res, 404, messageManager.getMissignUserMessage())
  
  return apiResponseManager.returnAPIWithBodyAndUser(res, 200, messageManager.getSuccessMessage() , currentUser, localConfig.resources)
})

app.get('/php-test-technique/episodes', (req, res) => {

  const localConfig = fileAccess.readJsonFileSync('parameters.json')
  const tokenReceived = req.get("X-Auth-Token")
  const correctToken = localConfig.resources.api.accessors[0].headers[0].value

  if (!dataChecker.isTokenValid(tokenReceived, correctToken))
    return apiResponseManager.returnAPI(res, 403, messageManager.getWrongTokenMessage())
  return apiResponseManager.returnAPIWithBody(res, 200, messageManager.getShortSuccessMessage(), fileAccess.readJsonFileSync('blackmirror.json'))

})

app.get('/php-test-technique/episodes/:episodeId', (req, res) => {

  const localConfig = fileAccess.readJsonFileSync('parameters.json')
  const episodeIdReceived = req.params.episodeId
  const tokenReceived = req.get("X-Auth-Token")
  const correctToken = localConfig.resources.api.accessors[0].headers[0].value
  
  if (!dataChecker.isTokenValid(tokenReceived, correctToken))
    return apiResponseManager.returnAPI(res, 403, messageManager.getWrongTokenMessage())
  if (dataChecker.idIsIncorrect(episodeIdReceived)) 
    return apiResponseManager.returnAPI(res, 400, messageManager.getMissignParamsMessage())
  const episode = fileAccess.getSpecificEpisodeFromJSON('blackmirror.json', 'utf8', episodeIdReceived)
  if (episode == null) return apiResponseManager.returnAPI(res, 404, messageManager.getWrongEpisodeId())
    return apiResponseManager.returnAPIWithBody(res, 200, messageManager.getShortSuccessMessage(), episode)
})