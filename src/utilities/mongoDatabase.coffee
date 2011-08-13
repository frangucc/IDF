#this database is meant to actually store the content that is retrieved by the workers
#it uses mongoose to connect to the database
#it should be used if content is no longer being retrieved live

#it currently doesn't work with filters

mongoose = require 'mongoose'
Schema = mongoose.Schema

ContentSchema = new Schema {
    title: String
    content: String
    author: String
    source: String
    url: String
    workerID: String
    query:String

}


mongoose.connect 'mongodb://localhost/augmentedContent'
mongoose.model 'Content', ContentSchema

Content = mongoose.model 'Content'

#clears the database
exports.clear = () ->
    Content.remove {}, () ->

#inserts an entry into the database
exports.insertIntoDB = (data) ->
    checkForDuplicate data, (duplicate, data) ->
        if !duplicate
            console.log "entered into db -"+data.workerID
            content = new Content();
            content.title = data.title
            content.content = data.content
            content.author = data.author
            content.source = data.source
            content.url = data.url
            content.workerID = data.workerID
            content.query = data.queryText
            
            content.save (err) ->
                if err
                    throw err
                
                #console.log "saved"
        else
            console.log "duplicate"

#prints the dtabase in the console
exports.printDB = () ->
    Content.find {}, (err, docs) ->
        for doc in docs
            console.log doc.title + " : " + doc.source + " - " + doc.url + " * " + doc.query
            console.log ""
            #eyes.inspect doc

#checks for a duplicate entry
checkForDuplicate = (data, callback) ->
    
    Content.find {query: data.queryText}, (err, docs) ->
        called = false
        if docs.length < 0
            called = true
            callback false, data
        if !called
            for doc in docs
                if doc.url == data.url
                    called = true
                    callback true, data
            if !called
                callback false, data

#returns all of the content for a particular header            
exports.getContent = (heading, res, callback) ->
    Content.find {query: heading}, (err, docs) ->
        if docs.length > 0
            callback res, docs
        else
            callback res, "no content"
