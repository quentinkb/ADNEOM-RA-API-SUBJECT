class DataChecker {
    
    constructor() {
        
    }
    userNotFound(currentUser) {
        return currentUser === null;
    }    
    userDataBaseUnreachable(localUsers) {
        return localUsers === 'undefined' || localUsers === undefined || localUsers === null || localUsers.users === 'undefined' || localUsers.users === undefined || localUsers.users === null || (localUsers.users.length == 0);
    }
    
    idIsIncorrect(idReceived) {
        return idReceived === undefined || idReceived === "undefined" || idReceived === null || isNaN(idReceived);
    }
    findUser(localUsers, idReceived) {
        let currentUser = null;
        localUsers.forEach(function (user) {
            if (user.id === idReceived) {
                currentUser = user;
            }
        });
        return currentUser;
    }
    isTokenValid(pToken, lToken) {
        if (pToken === undefined || pToken === 'undefined' || pToken === null) {
            return false;
        } else {
            var localAuthToken = lToken;
            return localAuthToken === pToken;
        }
    }    
}

module.exports = DataChecker