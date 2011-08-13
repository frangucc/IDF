Bing = require "./bing"

#this class is for querying the hyperphysics website through the google api
module.exports = class HyperPhysics extends Bing
    
    constructor: (limit) ->
        super limit
        @subjects.science = true
        
        @workerID = "hp"
        @siteName = "HyperPhysics - Georgia State University"
    
    enterQueryinPath: (query) ->      
        @pathParts.options.query =  query + " site:hyperphysics.phy-astr.gsu.edu"
