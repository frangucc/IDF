jsdom = require "jsdom"
fs = require "fs"
MySql = require "../utilities/mySqlDatabase"
mySql = new MySql()
Eyes = require "eyes"

classes = new Object()
ids = new Object()
tags = new Object()

readFile = (filePath, callback) ->
    fs.readFile filePath, encoding='utf8', (error, data) ->

        if error
            console.log "Error in file reader"
            throw error
        callback data

getClassesIdsTags = (node) ->
    if node?.className?.length? && node.className.length > 0
        classArray = node.className.split(' ')
        for classA in classArray
            classes[classA] = true
    
    if node?.id?.length? && node.id.length > 0
        ids[node.id] = true
    
    if node?._tagName?.length?
        tags[node._tagName] = true unless node._tagName == "body"
    
    if node._childNodes?.length? > 0
        for child in node._childNodes
            getClassesIdsTags child

insertIDFObjects = (node, parent, associationObj) ->
    isIDFObject = false
    
    properties = new Array()
    
    if node?.id?.length? && node.id.length > 0
        properties.push {
            name: node.id
            type: "id"
        }
    
    if node?.className?.length? && node.className.length > 0
        classArray = node.className.split(' ')
        for classA in classArray
            properties.push {
                name: classA
                type: "class"
            }
        
    if node?._tagName?.length?
        properties.push {
            name: node._tagName
            type: "tag"
        }
    
    for property in properties
        if associationObj[property.type]?[property.name]?.length? > 0
            for component in associationObj[property.type][property.name]
                
                content = ""
                if node.innerHTML? && node.outerHTML != ""
                    content = node.outerHTML
                else if node.src? && node.src!= ""
                    content = node.src
                
                options = new Object()
                options = {
                    sectionId: associationObj.sectionId
                    packageId: associationObj.packageId
                    componentId: component
                    content: content
                    parentId: parent
                    tag: node._tagName
                }
                
                if isIDFObject == false
                
                    lastObject = options
                
                    isIDFObject = true
                
                else
                    mySql.insertObject options, () ->
    
    if isIDFObject
        mySql.insertObject lastObject, (newParentId) ->
            if node._childNodes?.length? > 0
                for child in node._childNodes
                    insertIDFObjects child, newParentId, associationObj
    
    else
        if node._childNodes?.length? > 0
            for child in node._childNodes
                insertIDFObjects child, parent, associationObj

exports.getProperties = (res, url, callback) ->
    classes = new Object()
    ids = new Object()
    tags = new Object()
    
    url = __dirname[0...-17]+"/public"+url
    readFile url, (html) ->
        jsdom.env html, ['http://code.jquery.com/jquery-1.5.min.js'], (errors, window) ->
            getClassesIdsTags window.$("body")[0]
            callback classes, ids, tags
            
exports.assignIDFObjects = (url, sectionId, packageId, callback) ->
    mySql.clearObjects () ->
    
    
    mySql.getAssociationsForPackage packageId, (associations) ->
        associationObj = {
            "class": new Object()
            "id": new Object()
            "tag": new Object()
            "sectionId": sectionId
            "packageId": packageId
        }
        for association in associations
            if !associationObj[association.type][association.name]?.length?
                associationObj[association.type][association.name] = new Array()
            associationObj[association.type][association.name].push association.componentId
        
        url = __dirname[0...-17]+"/public"+url
        readFile url, (html) ->
            jsdom.env html, ['http://code.jquery.com/jquery-1.5.min.js'], (errors, window) ->
                insertIDFObjects window.$("body")[0], 0, associationObj
                #callback classes, ids, tags

        
        
