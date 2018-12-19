class APIResponseManager {
    returnAPI(res, code, message) {
        return res.status(code).send({ 
            code,
            message
        })
    }
    returnAPIWithBody(res, code, message, resources) {
        return res.status(code).send({
            code,
            message,
            resources
        })
    }
    
    returnAPIWithBodyAndUser(res, code, message, user, resources) {
        return res.status(code).send({
            code,
            message,
            user,
            resources
        })
    }
}
module.exports = APIResponseManager