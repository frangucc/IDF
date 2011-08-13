Yql = require "./yql"

#this class is for use as a termextractor, it uses yql to get results
module.exports = class TermExtractor extends Yql
    #it is not opentable so it passes false to the yql constructor
    constructor: (limit) ->
        super false, limit
    
    enterQueryinPath: (query) ->      
        @pathParts.options.q =  'select * from search.termextract where context="'+ query + '"'
    
    getOutput: (results) ->
        return @applyLimit results.Result
