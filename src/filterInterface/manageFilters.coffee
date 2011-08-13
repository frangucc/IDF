#this file contains functions that manage the filters in the database
tree = require "./formatJSONTree"
filterDb = require "./filterDatabase"

#this function is a recursive fucntion that attempts to return a desired node
#it does so by moving down the json tree
findNode = (id, currNode) ->
    if currNode.attr.class.indexOf("filter") < 0
        if "#{id}" == "#{currNode.attr.id}"
            return currNode
        else
            currentIndex = 0
            goodIndex = 0
            while currentIndex < currNode.children.length
                if currNode.children[currentIndex].attr.class.indexOf("filter") < 0
                    if currNode.children[currentIndex].attr.id <= id
                        goodIndex = currentIndex
                currentIndex++
            findNode(id, currNode.children[goodIndex])

#this recursive function returns an array of id's of all of the children of the input nodes
getChildren = (node) ->
    array = new Array()
    if node.attr.class.indexOf("filter") < 0
        array.push node.attr.id
        for child in node.children
            array2 = getChildren(child)
            if array2.length > 0
                for element in array2
                    array.push element
    return array

#this function is the second step in an addition of a filter
#it takes a filter object and a propagate boolean
adder = (filter, propagate) ->
    #it first checks to see with the filter is one that provides alternative text
    #if that is the case then the filter shoudl not propagate (be applied to children)
    if filter.filter[0...4] == "alt:"
        propagate = "no"
    
    #if propagate is no, the function simply inserts the filter into the database
    if propagate == "no"
        filterDb.insertIntoDB filter
    #if propagate is yes the function calls upon the propagate function with the action of add
    if propagate == "yes"
        propagation filter, "add"

#this function is the second step in an addition of a filter
#it takes a filter object, a propagate boolean, and a removal boolean
#this is similar to the above function except it also removes filters
#IMPORTANT - the way filters are "edited" is by removing the original filter and then adding the changed filter 
editer = (filter, propagate, removal) ->
    if filter.original[0...4] == "alt:"
        propagate = "no"
    
    if propagate == "no"
        filterDb.deleteFromDB filter.id, filter.package, filter.original
        if removal == "no"
            filterDb.insertIntoDB filter
    
    if propagate == "yes"
        if removal == "yes"
            propagation filter, "remove"
        if removal == "no"
            propagation filter, "remove_add"             

#this propagation function allows for changes to be made to both the targeted node and its children
propagation = (filter, action) ->
    #1. it gets the tree
    tree.getJSON false, (tree) ->
        #2. it sets node equal to the node targeted by the filter by calling upon the findNode method
        node = findNode filter.id, tree.children[filter.package]
        #3. it gets the children of the targeted node
        childrenIdArray = getChildren node
        #4 it iterates through the children and performes the specified actions
        for childId in childrenIdArray
            #this will remove the filter if that is specified
            if action == "remove_add" || action == "remove"
                filterDb.deleteFromDB childId, filter.package, filter.original
            
            #this will add the filter if that is specified
            if action == "remove_add" || action == "add"
                #a new temporary filter is created because otherwise the filter will be passed by reference and all of the same filter will be added
                filterTemp = new Object()
                filterTemp.id = childId
                filterTemp.filter = filter.filter
                filterTemp.subjects = filter.subjects
                filterTemp.package = filter.package
                
                filterDb.insertIntoDB filterTemp

###
formData = {
    id: "#"
    package: "#"
    text: "..."
    subjects: [
        "wikipedia",
        etc...
    ],
    propagate: "yes" or "no"
}
###
#this function sets up an addition of a filter
exports.add = (formData, allWorkers) ->    
    filter = {
        id: formData.id
        package: formData.package
        filter: formData.text
        subjects: {}
    }
    
    for worker, name of allWorkers
        filter.subjects[worker] = false
    
    for subject in formData.subjects
        filter.subjects[subject] = true
    
    adder filter, formData.propagate    

###
formData = {
    id: "#"
    package: "#"
    removal: "yes" or "no"
    text: "..."
    subjects: [
        "wikipedia",
        etc...
    ],
    propagate: "yes" or "no"
}
###
#this function sets up the edit of a filter
exports.edit = (formData, allWorkers) ->    
    filter = {
        id: formData.id
        package: formData.package
        filter: formData.text
        subjects: {}
        original: formData.original
    }
    
    for worker, name of allWorkers
        filter.subjects[worker] = false
    
    for subject in formData.subjects
        filter.subjects[subject] = true
    
    editer filter, formData.propagate, formData.removal
