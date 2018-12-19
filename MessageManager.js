class MessageManager {

    getWrongTokenMessage() {
        return "Votre token n'est pas valide ou est mal renseigné"
    }
    getMissignParamsMessage() {
        return "Un ou plusieurs paramètres sont manquants ou malformés"
    }
    getTechnicalErrorMessage() {
        return "[Erreur technique] - la base de données utilisateurs n'est pas joignable"
    }
    getMissignUserMessage() {
        return "[Utilisateurs manquant] - vous n'êtes pas encore réferencé dans nos bases."
    }
    getSuccessMessage() {
        return "Bravo, voici les informations nécessaires pour la suite du test."
    }
    getShortSuccessMessage() {
        return "Succès"
    }
    getWrongEpisodeId() {
        return "L'épisode demandé n'existe pas."
    }
}

module.exports = MessageManager