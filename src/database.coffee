Client = require('mysql').Client
Eyes = require 'eyes'
client = new Client()

database = "benchprep"
tableC = "IDF_Components"
tableA = "IDF_Associations"
tableO = "IDF_Objects"

client.user = "user"
client.password = "password"
client.host = "localhost"


connect = (callback) ->
    client.connect (err, results) ->
        if err
            throw err 
        client.query "USE #{database}", (err, results, fields) ->
            if err
                throw err
            else
                callback true

query = (queryText, callback) ->
    client.query queryText, (err, results, fields) ->
        if err
            throw err
        callback results, fields

module.exports = class MySql
    
    getIDFComponents: (callback) ->
        connect () ->
            queryText = "SELECT id, name FROM #{tableC}"
            query queryText, (results) ->
                if results.length<1
                    console.log "no results"
                callback results
                
    insertIDFComponent: (name, callback) ->
        connect () ->
            queryText = "INSERT INTO #{tableC} (name) VALUES ('#{name}')"
            query queryText, () ->
                callback true
    
    renameIDFComponent: (id, newName, callback) ->
        connect () ->
            queryText = "UPDATE #{tableC} SET name='#{newName}' WHERE id=#{id}"
            query queryText, () ->
                callback true
    
    deleteIDFComponent: (id, callback) ->
        connect () ->
            queryText = "DELETE FROM #{tableC} WHERE id=#{id}"
            query queryText, () ->
                callback true
            
    getAssociationsForPackage: (packageId, callback) ->
        connect () ->
            queryText = "SELECT * FROM #{tableA} WHERE packageId=#{packageId}"
            query queryText, (results) ->
                callback results
                
    getAssociationsForPackageWithComponent: (packageId, callback) ->
        connect () ->
            queryText = "SELECT a.id, a.type, a.name, c.name AS component "
            queryText += "FROM #{tableA} a "
            queryText += "INNER JOIN #{tableC} c "
            queryText += "ON a.componentId = c.id "
            queryText += "WHERE a.packageId=#{packageId}"
            query queryText, (results) ->
                callback results
    
    getAssociationsForIDFComponent: (componentId, callback) ->
        connect () ->
            queryText = "Select * FROM #{tableA} WHERE componentId=#{componentId}"
            query queryText, (results) ->
                callback results
                
    insertAssociation: (packageId, type, name, componentId, callback) ->
        connect () ->
            queryText = "INSERT INTO #{tableA} (packageId, type, name, componentId) "
            queryText += "VALUES (#{packageId}, '#{type}', '#{name}', #{componentId})"
            
            query queryText, () ->
                callback true
    
    deleteAssociation: (id, callback) ->
        connect () ->
            queryText = "DELETE FROM #{tableA} WHERE id=#{id}"
            query queryText, () ->
                callback true

    getObjectsForSection: (sectionId, callback) ->
        connect () ->
            queryText = "SELECT * FROM #{tableO} WHERE sectionId=#{sectionId}"
            query queryText, (results) ->
                callback results

    getOjectsForSectionByType: (sectionId, componentId) ->
        connect () ->
            queryText = "SELECT * FROM #{tableO} WHERE sectionId=#{sectionId} AND componentId=#{componentId}"
            query queryText, (results) ->
                callback results
                
    insertObject: (options, callback) ->
        connect () ->
            queryText = "INSERT INTO #{tableO} (packageId, sectionId, componentId, content, parentId, tag) "
            queryText += "VALUES (#{options.packageId}, #{options.sectionId}, #{options.componentId}, '#{options.content}', #{options.parentId}, '#{options.tag}')"
            query queryText, (results, fields) ->
                callback results.insertId
    
    clearObjects: (callback) ->
        connect () ->
            queryText = "DELETE FROM #{tableO}"
            query queryText, (results, fields) ->
                callback true
    
    deleteObject: (id, callback) ->
        connect () ->
            queryText = "DELETE FROM #{tableO} WHERE id=#{id}"
            query queryText, () ->
                callback true

    getHTMLFilesForPackage: (packageId, callback) ->
        conenct () ->
            queryText = "SELECT content_package_id, html_file FROM readings WHERE content_package_id=#{packageId}"
            query queryText, (results) ->
                callback results
