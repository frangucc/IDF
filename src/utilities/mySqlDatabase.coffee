#this file provides all of the functions for working with the benchprep mysql database

Client = require('mysql').Client
Eyes = require 'eyes'
client = new Client()
#the database is called benchprep on my computer but may be called something different elsewhere
database = "benchprep"
#the table used is mostly the sections table
table = "sections"
#one function makes use of the content_packages table as well
table2 = "content_packages"

tableC = "IDF_Components"
tableA = "IDF_Associations"
tableO = "IDF_Objects"

field = "name"

#this is connection information for the mysql server
client.user = ""
client.password = ""
client.host = "localhost"


connect = (callback) ->
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
    #this method allows express to get all of the headers, by allowing res to get passed through the function
    getHeadersExpress: (res, callback) ->
        connect () ->
            queryText = "SELECT DISTINCT "+field+" FROM "+table
            query queryText, (results) ->
                if results.length<1
                    console.log "no results"
                    throw "error with database"
                callback res, results
    
    #this function passes an array of section headings and to the callback
    getHeaders: (callback) ->
        connect () ->
            queryText = "SELECT DISTINCT "+field+" FROM "+table
            query queryText, (results) ->
                if results.length<1
                    console.log "no results"
                    throw "error with database"
                callback results
    
    #this function returns the entire sections table for use by the tree structure
    getAll: (callback) ->
        connect () ->
            queryText = "SELECT * FROM "+table+" ORDER BY id"
            query queryText, (results) ->
                if results.length<1
                    console.log "no results"
                    throw "error with database"
                callback results
    
    #this function gets all of the titles from the packages database
    getPackages: (callback) ->
        connect () ->
            queryText = "SELECT id, title FROM "+table2
            query queryText, (results) ->
                if results.length<1
                    console.log "no results"
                    throw "error with database"
                callback results
    
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
    
    getObjectsForSectionWithComponent: (sectionId, callback) ->
        connect () ->
            queryText = "SELECT * FROM #{tableO} WHERE sectionId=#{sectionId}"
            queryText = "SELECT o.id, o.packageId, o.sectionId, o.componentId, o.content, o.parentId, o.tag, c.name AS component "
            queryText += "FROM #{tableO} o "
            queryText += "INNER JOIN #{tableC} c "
            queryText += "ON o.componentId = c.id "
            queryText += "WHERE o.sectionId=#{sectionId}"
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
