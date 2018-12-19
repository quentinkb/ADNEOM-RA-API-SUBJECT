const fs = require("fs")

class FileAccess {  
    readJsonFileSync(filepath, encoding)
    {
        if (typeof (encoding) == 'undefined'){
            encoding = 'utf8';
        }
        var file = fs.readFileSync(filepath, encoding);
        return JSON.parse(file);
    }
    getSpecificEpisodeFromJSON(filepath, encoding, episodeId) {
        const listOfEpisodes = this.readJsonFileSync(filepath, encoding)._embedded.episodes
        for(let episode of listOfEpisodes) {
            if (episode.id == episodeId) return episode
        }
        return null
    }
}

module.exports = FileAccess