#The worker class is the superclass for all workers
queryString = require "querystring"
http = require "http"
eyes = require "eyes"

module.exports = class Worker
    #The constructor sets up the generic framework for various variables
    #it takes limit as a parameter, limit determines how many results are returned from a particular query
    constructor: (limit = 5) ->
        #requestoptions is an object that is fed to the http.get command
        @requestOptions = {
            host: "",
            port: 80,
            path: "",
            headers: {"user-agent": "BenchPrep content augmentation client contact @ chicago@benchprep.com"}

        }
        #pathparts is an object that is used to generate the path for the http get command
        #the base consists of the main path usually ending with "?"
        #the options are the options being passed with the get command such as the query
        @pathParts = {
            base: "",
            options: {}
        }
        #subjects is an object to indicate for which subjects the worker should be active
        #setting all to true should be effectively the same as setting the rest to true
        #subjects is no longer relevant in the new workforce
        @subjects = {
            math: false
            science: false
            english: false
            writing: false
            all: false
        }
        @limit = limit
        
        @workerID = "worker"
        @workerName = "Worker"
        
    #query is the main function for the worker class
    #it takes a query parameter which is a string to be searched, and a callback which it calls at the end of the function
    #the callback is passed two parameters "valid" and "output"
    #valid = "true" if there were good results passed to output
    #valid = "no results" if there were no results from the query
    #or valid = "[some error]" if there was an error
    
    query: (query, callback) ->
        worker = @
        @queryText = query
        @callback = callback
        
        #calls this method with query to put the query into the pathOptions object
        @enterQueryinPath(@shortenQuery(query))
        
        #compiles the final path for the get command
        @requestOptions.path = @pathParts.base + queryString.stringify(@pathParts.options)
        
        #starts the request with request options
        req = http.get @requestOptions, (response) ->
            text = "";
            
            response.on "data", (data) ->
                text += data
            
            response.on "end", () ->
                
                try
                    jsonData = eval ('(' + text + ')')
                    worker.error = false
                
                #if the data is not proper json, then the callback function is exectued with an error passed as the first param
                catch e
                    message = "not valid JSON"+"-"+worker.workerID
                    console.log text
                    worker.error = true
                    worker.callback message, ""
                
                if worker.error == false
                    #the data is passed to a function that validates the data and returns the data in correct format for output
                    worker.validateData jsonData, (valid, outputData) ->
                        worker.output = outputData
                        #the callback is then callled with the outputdata
                        if valid == "true" 
                            worker.callback("true", outputData)
                        else
                            message = valid+"-"+worker.workerID
                            worker.callback(message, "")
    
    #this function needs to be defined by each subclass
    #the param is the query itself, and there is no return as it interacts directly with a class object
    enterQueryinPath: () ->

    #this function validates the data to make sure that there are results within the json structure and needs to be defined in subclasses
    #the params are the data to be validated, and a callback
    #the function calls the callback with the (valid) data being passed to the getoutput function
    validateData: (jsonData, callback) ->
    
    #this function formates the output so that the output returned has a standard structure for entry into a database or further manipulation
    getOutput: () ->
    
    #apply limit simply slices the output array so that only a limited amount of results are returned
    applyLimit: (output) ->
        if @limit < 1
            return output[0...1]
        return output[ 0...@limit ]
    
    #shorten query returns a string that no longer contains numbers
    shortenQuery: (query) ->
        shortQuery = ""
        for word in query.split(" ")
            if !/[0-9]/.test(word) 
                shortQuery += word
                shortQuery +=" "
        if shortQuery.length == 0
            return query
        else
            #the substring command removes the extra space at the end
            return shortQuery.substring 0, shortQuery.length-1
