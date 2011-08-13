Bing = require "./bing"

#this class is for querying the wolframmathworld website through the bing api
module.exports = class WolframMathWorld extends Bing
    
    constructor: (limit) ->
        super limit
        @subjects.math = true
        
        @workerID = "wmw"
        @siteName = "Wolfram MathWorld"
    
    enterQueryinPath: (query) ->      
        @pathParts.options.query =  query + " site:mathworld.wolfram.com"
