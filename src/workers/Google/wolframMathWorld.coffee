Google = require "./google"

#this class is for querying the wolframmathworld website through the google api
module.exports = class WolframMathWorld extends Google
    
    constructor: (limit) ->
        super limit
        @subjects.math = true
        
        @workerID = "wmw"
        @siteName = "Wolfram MathWorld"
    
    enterQueryinPath: (query) ->      
        @pathParts.options.q =  query + " site:mathworld.wolfram.com"
