Worker = require "./worker"

#this class defines a quizlet search bot
module.exports = class Quizlet extends Worker
    
    constructor: (limit) ->   
        super limit
        
        @requestOptions.host = "api.quizlet.com"       
        @pathParts.base = "/1.0/sets?"       
        @pathParts.options = {
            dev_key: "YCffV6yVSwXsKWt9"
            q: ""
            per_page: limit
            extended: "on"
        }
        
        @workerID = "quizlet"
        @siteName = "Quizlet Flash Cards"
        
        @subjects.all = true
        
    enterQueryinPath: (query) ->      
        @pathParts.options.q =  query
    
    #the param is an array of all of the results objects, this function formats each results and pushes them onto a new output array
    getOutput: (results) ->
        output = new Array()
        for result in results
            
            if result.description == ""
                result.description = "Flashcards about "+result.title
            
            output.push {
                title: result.title
                content: result.description
                author: result.creator
                source: @siteName
                url: result.url
                workerID: @workerID
                queryText: @queryText
            }
        return @applyLimit output
    
    #the format of the returned data is an array with its first slot as the original query and its second slot (index 1) as an array of titles of matching articles
    validateData: (jsonData, callback) ->
        if !jsonData?.response_type?
            callback "errorWithJSONObject", ""
        else if jsonData.response_type == "error"
            callback "no results", ""      
        else
            callback "true", @getOutput(jsonData.sets)
