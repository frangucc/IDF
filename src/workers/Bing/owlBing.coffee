Bing = require "./bing"

#this class is for querying the online writing lab website through the bing api
module.exports = class Owl extends Bing
   
    constructor: (limit) ->
        super limit
        @subjects.english = true
        @subjects.writing = true
        
        @workerID = "owl"
        @siteName = "OWL - The Purdue Online Writing Lab"
   
    enterQueryinPath: (query) ->      
        @pathParts.options.query =  query + " site:owl.english.purdue.edu"
