Worker = require "../worker"

#this class defines a bing search bot which can be extended for particular searches or can be used on its own
module.exports = class Bing extends Worker
    
    #the constructor takes the result limit and passes it to the generic constructor
    constructor: (limit) ->   
        super limit
        
        #defines the various parts of the path to be compiled in the query function once a query is passed
        @requestOptions.host = "api.bing.net"       
        @pathParts.base = "/json.aspx?"       
        @pathParts.options = {
            appid: "9281FFC2A1A9926DFD374D32CA26EA3D8175869C"
            version: "2.2"
            market: "en-us"
            query: ""
            sources: "web"
            "web.count": limit
        }
        
        @workerID = "bing"
        @siteName = "Bing.com"
    
    #for a bing search, the query needs to be passed to the 'q' option    
    enterQueryinPath: (query) ->      
        @pathParts.options.query =  query
    
    #the param is an array of all of the results objects, this function formats each results and pushes them onto a new output array
    getOutput: (results) ->
        output = new Array()
        for result in results
            output.push {
                title: result.Title
                content: result.Description
                author: @siteName
                source: @siteName
                url: result.Url
                workerID: @workerID
                queryText: @queryText
            }   
        return @applyLimit output
    
    #the bing json object has results if the results array is populated
    validateData: (jsonData, callback) ->
        if !jsonData?.SearchResponse?.Web?.Total?
            console.log jsonData
            callback "errorWithJSONObject", ""
        else if jsonData.SearchResponse.Web.Total == 0
            callback "no results", ""
        else
            #calls the callback back to the query function except it first passes the results array to the getoutput function
            callback "true", @getOutput(jsonData.SearchResponse.Web.Results)
