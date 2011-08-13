#this class provides three methods
#1. a readfile method that takes in a file according a certain path
#2. a striphtml method that uses a regular expression to strip html tags
#3. a method that combines the first two and provides the callback with the result

#all of these methods are asynchronous and require callbacks

fs = require "fs"

module.exports = class FileUtility    

    readFile: (filePath, callback) ->
        
        fs.readFile filePath, (error, data)->
            
            if error
                console.log "Error in file reader"
                throw error
                
            callback data
            
    stripHTML: (text, callback) ->
        
        plainText = String(text).replace /(<([^>]+)>)/ig, ""
        
        callback plainText
        
    readAndStripHTML: (filePath, callback) ->       
        me = @
        @readFile filePath, (data) ->
            me.stripHTML data, (plainText) -> 
                callback plainText
