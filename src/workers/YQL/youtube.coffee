Yql = require "./yql"

#this class defines a youtube worker that makes use of yql's open tables
module.exports = class Youtube extends Yql
    
    constructor: (limit) ->
        #passes true to the yql constructor because it is from open tables
        super true, limit        
        @subjects.all = true
        
        @workerID = "youtube"
        @siteName = "Youtube"
    
    enterQueryinPath: (query) ->      
        @pathParts.options.q =  'select * from youtube.search where query="'+ query + '"'
    
    #youtube videos have a particular format where the reusults array is populated with video objects that have metadata as properties
    getOutput: (results) ->
        output = new Array()
        for video in results.video
            output.push {
                title: video.title
                content: video.content
                author: video.author
                source: @siteName
                url: video.url
                workerID: @workerID
                queryText: @queryText
            }
        return @applyLimit output
