Worker = require "../worker"

#this class defines a google search bot which can be extended for particular searches or can be used on its own
module.exports = class Google extends Worker
    
    #the constructor takes the result limit and passes it to the generic constructor
    constructor: (limit) ->   
        super limit
        
        #defines the various parts of the path to be compiled in the query function once a query is passed
        @requestOptions.host = "ajax.googleapis.com"       
        @pathParts.base = "/ajax/services/search/web?"       
        @pathParts.options = {
            v: "1.0",
            q: ""
        }
        
        @workerID = "google"
        @siteName = "Google"
    
    #for a google search, the query needs to be passed to the 'q' option    
    enterQueryinPath: (query) ->      
        @pathParts.options.q =  query
    
    #the param is an array of all of the results objects, this function formats each results and pushes them onto a new output array
    getOutput: (results) ->
        output = new Array()
        for result in results
            output.push {
                title: result.titleNoFormatting
                content: result.content
                author: @siteName
                source: @siteName
                url: result.url
                workerID: @workerID
                queryText: @queryText
            }   
        return @applyLimit output
    
    #the google json object has results if the results array is populated
    validateData: (jsonData, callback) ->
        if !jsonData?.responseData?.results?
            console.log jsonData
            callback "errorWithJSONObject", ""
        else if jsonData.responseData.results.length < 1
            callback "no results", ""
        else
            #calls the callback back to the query function except it first passes the results array to the getoutput function
            callback "true", @getOutput(jsonData.responseData.results)
