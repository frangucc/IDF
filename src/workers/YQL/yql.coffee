Worker = require "../worker"

#this class defines a yql worker, however it needs to be extended because the way output is returned depends on the particular api being queried
module.exports = class Yql extends Worker
    
    #the constructor takes the result limit and passes it to the generic constructor
    #it also takes an opentable variable which is boolean, if it is true then an additional option is added to the pathparts.options object
    constructor: (openTable, limit) ->      
        super limit
        
        @requestOptions.host = "query.yahooapis.com"       
        @pathParts.base = "/v1/public/yql?"       
        @pathParts.options = {
            q: "",
            format: "json",
            diagnostics: "false",
            callback: ""
        }
        
        @pathParts.options.env = "store://datatables.org/alltableswithkeys" unless openTable == false
        
        @workerID = "yql"
        @workerName = "Yahoo Query Language"
    
    #the yql json object has results if the count value is greater than 0  
    validateData: (jsonData, callback) ->
        if !jsonData?.query?.count?
            callback "errorWithJSONObject", ""
        else if jsonData.query.count < 1
            callback "no results", ""    
        else
            #calls the callback back to the query function except it first passes the results array to the getoutput function
            callback "true", @getOutput(jsonData.query.results)

