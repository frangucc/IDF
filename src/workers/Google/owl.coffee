Google = require "./google"

#this class is for querying the online writing lab website through the google api
module.exports = class Owl extends Google
   
    constructor: (limit) ->
        super limit
        @subjects.english = true
        @subjects.writing = true
        
        @workerID = "owl"
        @siteName = "OWL - The Purdue Online Writing Lab"
   
    enterQueryinPath: (query) ->      
        @pathParts.options.q =  query + " site:owl.english.purdue.edu"
