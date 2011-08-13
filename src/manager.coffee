MySql = require './utilities/mySqlDatabase'
mySql = new MySql()

WorkForce = require './workers/workForce'
workForce = new WorkForce()

filterDb = require './filterInterface/filterDatabase'

#this manages the querying of the workforce and the format of the results
exports.liveQuery = (name, id, res, callback) ->
        #it first gets the filter hash for getting the filters for the section being used
        filterDb.getDBbyID (filterHash) ->
            if filterHash[id]?.length? > 0
                filters = filterHash[id]
            else
                filters = "none"
            #it then calls the workhorse method of the work force with the name of the section, the corresponding filters and a callback
            workForce.getContent name, filters, (results) ->
                workerOutput = new Object()
                #checks to see if there are results
                if results.length > 0
                    #for each result it starts creating a hash where the keys are the workerid's and the values are the results
                    #the hash has correct json syntax so can easily be sent as purely a json object
                    for result in results
                        if !(workerOutput[result.workerID]?)
                            workerOutput[result.workerID] = new Array()
                        workerOutput[result.workerID].push result
                    callback workerOutput
                else
                    callback "no results"

exports.getComponents = (callback) ->
    mySql.getIDFComponents (results) ->
        callback results

exports.handleComponentsForm = (submission, callback) ->
    
    functionCall = (callback) ->
        callback()
    
    switch submission.action
        when "new" then functionCall = (callback) ->
            mySql.insertIDFComponent submission.name, () ->
                callback true
        when "rename" then functionCall = (callback) ->
            mySql.renameIDFComponent submission.componentId, submission.name, () ->
                callback true
        when "delete" then functionCall = (callback) ->
            mySql.deleteIDFComponent submission.componentId, () ->
                callback true
    
    functionCall () ->
        callback true
        
exports.handleAssociationForm = (submission, callback) ->
    type = "none"
    if submission.classes != "none"
        type = "class"
        name = submission.classes
        
    if submission.tags != "none"
        type = "tag"
        name = submission.tags
        
    if submission.ids != "none"
        type = "id"
        name = submission.ids
        
    mySql.insertAssociation submission.packageId, type, name, submission.componentId, () ->
        callback true

exports.getAssociationsAndComponents = (packageId, callback) ->
    mySql.getAssociationsForPackageWithComponent packageId, (associations) ->
        callback associations
        
exports.handleAssociationRemovalForm = (submission, callback) ->
    mySql.deleteAssociation submission.association, () ->
        callback true
