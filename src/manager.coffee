MySql = require './database'
mySql = new MySql()



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
