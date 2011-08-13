MySql = require "../utilities/mySqlDatabase"
mySql = new MySql()

tree = new Object()

addNodes = (results, callback) ->
    for result in results
        node = {
            data: "#{result.component}"
            attr: {
                id: result.id
                packageId: result.packageId
                parentId: result.parentId
                sectionId: result.sectionId
                tag: result.tag
                class: "component"
            }
            children: new Array()
        }
        
        node.children.push {
            data: "html"
            attr: {
                class: "content-node"
            }
            children: [{
                data: result.content
                attr: {
                    class: "content"
                }
            }]
        }
        node.attr.href = "/getContent/#{node.attr.id}/#{node.data}"
        addChild node, tree
    callback()

addChild = (newNode, currentNode) ->

    if currentNode.attr.id == newNode.attr.parentId
        currentNode.children.push newNode
    else
        if currentNode.children.length > 0
            currentIndex = 0
            goodIndex = 0
            while currentIndex < currentNode.children.length
                if currentNode.children[currentIndex].attr.id <= newNode.attr.parentId
                    goodIndex = currentIndex
                currentIndex++
            addChild(newNode, currentNode.children[goodIndex])
        else
            console.log "help - infinite loop"

exports.createTree = (sectionId, callback) ->
    tree = {
        data: "Section"
        attr: {
            id: 0
            class: "Head"
        }
        state: "open"
        children: new Array()
    }
       
    mySql.getObjectsForSectionWithComponent sectionId, (results) ->
        addNodes results, ()->
            callback tree
    
