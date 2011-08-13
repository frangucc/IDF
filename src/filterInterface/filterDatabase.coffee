#this file defines the functions for the database of filters
#all of the filters are stored in a mongo database under the veil of a mongoose connection
mongoose = require 'mongoose'
Schema = mongoose.Schema
eyes = require 'eyes'

#this outlines how filters are stored in the database
#note: at this point this is not extensible to more workers but could be made so in the future
schemaObject = {
    id: Number
    package: Number
    filter: String
}

for worker, name of allWorkers
    schemaObject[worker] = Boolean

FilterSchema = new Schema schemaObject

mongoose.connect 'mongodb://localhost/augmentedContent'
mongoose.model 'Filter', FilterSchema

Filter = mongoose.model 'Filter'

#Used to clear the database if a fresh start is needed
exports.clear = () ->
    Filter.remove {}, () ->

###
data should be of the format
data = {
    id: int
    filter: string
    subjects: {
        owl: Boolean
        wmw: Boolean
        hp: Boolean
        youtube: Boolean
        wikipedia: Boolean
    }
}
###
#this function inserts a filter into the database
#it takes a filter as input (see above for the format)
exports.insertIntoDB = (data) ->
    #it first checks for a duplicate
    checkForDuplicate data, (duplicate, data) ->
        if !duplicate
            console.log "entered into db -"+data.id
            
            #this creates a new filter object and assigns its properties to the similar properties of data
            filter = new Filter();
            filter.id = data.id
            filter.package = data.package
            filter.filter = data.filter
            
            for worker, use of data.subjects
                filter[worker] = use
                        
            filter.save (err) ->
                if err
                    throw err
        else
            console.log "duplicate"

#this function prints the contents of the database to the console used for dev only     
exports.printDB = () ->
    Filter.find {}, (err, docs) ->
        for doc in docs
            eyes.inspect doc

#this function passes a hash of the filters to the callback given
#the hash is such that its keys are the id's of the sections that have filters
#and its values are arrays of filters for those id's
exports.getDBbyID = (callback) ->
    Filter.find {}, (err, docs) ->
        filters = new Object()
        for doc in docs
            currId = doc.id
            if !(filters[currId]?.length? > 0)
                filters[currId] = new Array()
            filters[currId].push doc
        callback filters

#this function checks for duplicate filters
#the fields it checks are id, filter, and package            
checkForDuplicate = (data, callback) ->   
    Filter.find {id: data.id}, (err, docs) ->
        called = false
        if docs.length < 0
            called = true
            callback false, data
        if !called
            for doc in docs
                if doc.filter == data.filter && doc.package == data.package
                    called = true
                    callback true, data
            if !called
                callback false, data

#this function gets a particular filter
#it takes as input the id of the section that the filter pertains to and the filter text itself
#it passes the filter object into the callback at the end of the function or it passes "no content" if no filter is found matching the criteria         
exports.getFilters = (id, filter, callback) ->
    Filter.find {id: id}, (err, docs) ->
        if docs.length > 0
            for doc in docs
                if doc.filter == filter
                    callback doc
        else
            callback "no content"

#this function simply removes a given filter from the db
#it takes the section id, the package id of the section and the filter text to ensure a unique match
exports.deleteFromDB = (id, package, filter) ->
    Filter.remove {id: id, filter: filter, package: package}, () ->
