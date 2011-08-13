Worker = require "./worker"

#this class defines a wikipedia search bot
module.exports = class Wikipedia extends Worker
    
    constructor: (limit) ->   
        super limit
        
        @requestOptions.host = "en.wikipedia.org"       
        @pathParts.base = "/w/api.php?"       
        @pathParts.options = {
            action: "opensearch"
            search: ""
            format: "json"
            limit: limit
        }
        
        @workerID = "wikipedia"
        @siteName = "Wikipedia.org"
        
        @subjects.all = true
        
    enterQueryinPath: (query) ->      
        @pathParts.options.search =  query
    
    #the param is an array of all of the results objects, this function formats each results and pushes them onto a new output array
    getOutput: (results) ->
        output = new Array()
        for result in results
            output.push {
                title: result
                #content: 
                author: @siteName
                source: @siteName
                url: "http://en.wikipedia.org/wiki/" + result
                workerID: @workerID
                queryText: @queryText
            }
        return @applyLimit output
    
    #the format of the returned data is an array with its first slot as the original query and its second slot (index 1) as an array of titles of matching articles
    validateData: (jsonData, callback) ->
        if !jsonData?[1]?
            callback "errorWithJSONObject", ""
        else if jsonData[1].length < 1
            callback "no results", ""      
        else
            callback "true", @getOutput(jsonData[1])
