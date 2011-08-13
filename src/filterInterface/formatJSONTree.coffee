#this is a rather long file whose sole purpose is to build all of the sections and filters into one long json object called "tree"
#the best way to understand this file is to start at the bottom and follow the series of callbacks through the getJSON function
MySql = require '../utilities/mySqlDatabase'
mySql = new MySql()
filterDb = require './filterDatabase'

#this is the actual tree object at the start, it is made with "global" scope to allow access by all methods
tree = new Object()

#this is just here to give filters a "global" scope
#filters will be a dump of the filters database
#its format will be a hash where the keys are the ids of the sections
filters = new Array()

###
nodes have this format
node = {
    data: string #the actual name of the section/package, is displayed in the tree
    children: array of nodes #an array of children nodes and of filter nodes
    attr: {
        id: int         #the section id, for packages id = 0
        package: int    #the package id
        parentId: int   #the section id of the parent node
        class: string   #a css class, class = "parent" if it is a parent section, "section" if it is a base section with no sub-sections, or "filter" if it is a filter
        href: string    #the url of the page that should be accessed upon the selection of this node in the tree
    }
}
###

#this function adds the first children to the tree
#it adds all of the packages
#as input it takes a number which represents the number of packages to be created
#even if a particular packageid does not exist in the package database, a package node is still created in order to allow for arraylike refrencing where the packageID is the index of that package in the tree.children array
addPackages  = (number, callback) ->
    i=0
    while i<number
        if !tree.children?[0]?
            tree.children = new Array()
        tree.children.push {
            data: "#{i}"
            attr: {
                id: 0
                class: "package"
                package: i
            }
            children: new Array()
        }
        i++
    #calls this function (defined below) to replace generic data value with the actual package name by querying the mysql database
    getPackageNames () ->
        for package in tree.children
            addFilters package
        #note: this is all done asynchronously with callbacks because a mysql database is involved with this function
        callback()

#this function goes through each section after it has been retrieved from the section database, creates a node out of its information, and passes it to the actual addition function
addNodes = (results, callback) ->
    for result in results
        node = {
            data: result.name
            attr: {
                id: result.id
                package: result.content_package_id
                parentId: result.parent_section_id
                class: "section" #initially set to section until it recieves a child node, then it changes to parent
            }
            children: new Array()
        }
        node.attr.href = "/getContent/#{node.attr.id}/#{node.data}"
        node = addFilters node
        addNode node
    callback()

#this function gets all the relevant filters from the filterhash (filters) and applies it to the new node
addFilters = (node) ->
    #all nodes receive a new_filter filter
    node.children.push {
        data: "new_filter"
        attr: {
            class: "new filter"
            href: "/addfilter/#{node.attr.package}/#{node.attr.id}/#{node.data}"
        }
    }
    #checks against hash for pre-existing filters then adds them
    if filters[node.attr.id]?.length?
        for filter in filters[node.attr.id]
            if "#{filter.package}" == "#{node.attr.package}"
                node.children.push {
                    data: filter.filter
                    attr: {
                        class: "filter"
                        href: "/editfilter/#{node.attr.package}/#{node.attr.id}/#{node.data}/#{filter.filter}"
                    }
                }
                      
    return node

#this function sets up the recursive function addChild by making the current node to find the parent node by the package node    
addNode = (newNode) ->
    myPackage = tree.children[newNode.attr.package]
    addChild newNode, myPackage

#this is a recursive function that attempts to add the newNode to its correct parent node
#when the function is first called by the "addNode" function currentNode is the top-level package node
addChild = (newNode, currentNode) ->
    #if the new node's parent's id is the currentNode's id, the parent node has been found and the the current node will be appended as a child of the parent
    if currentNode.attr.id == newNode.attr.parentId
        #the current node is given the class of parent because it now has a child
        currentNode.attr.class = " parent"
        #the new node is pushed into the children array of currentnode
        currentNode.children.push newNode
    else
        #if the currentnode is not the parent, then the function looks for the closest ancestor of the child
        #by virtue of the fact that the id's are in order of the tree you can use this loop to find the next ancestor
        if currentNode.children.length > 0
            currentIndex = 0
            goodIndex = 0
            while currentIndex < currentNode.children.length
                if currentNode.children[currentIndex].attr.class.indexOf("filter") < 0
                    if currentNode.children[currentIndex].attr.id <= newNode.attr.parentId
                        goodIndex = currentIndex
                currentIndex++
            addChild(newNode, currentNode.children[goodIndex])
        else
            console.log "help - infinite loop" #you should don't want to see this for obvious reasons

#this looks through the tree for packages without content and removes them
#this function is only useful if you want the tree to look good            
removeBlankPackages = (callback) ->
    i = tree.children.length-1
    while i>=0
        if tree.children[i].children.length == 1
            tree.children.splice(i, 1)
        i--
    callback()

#this queries the mysql database for the content packages table
#it assigns the correct titles to each of the packages
getPackageNames = (callback) ->
    titleHash = new Object()
    mySql.getPackages (results) ->
        for result in results
            titleHash[result.id] = result.title
        for package in tree.children
            if titleHash[package.attr.package]?
                package.data = titleHash[package.attr.package]
        callback()

module.exports = {
    #this function is the main worker
    #it takes as input forView which is a boolean that should be true only if the tree is being obtained for display, and should be false otherwise
    #the callback gets passed the tree at the function's conclusion
    getJSON: (forView, callback) ->
        #1. initialize the tree
        tree = {
            data: "Head"
            attr: {
                id: -1
                package: -1
            }
            state: "open"
        }
        #2. initialize the filterhash
        filterDb.getDBbyID (filterHash) ->
            #3. give the filterhash global scope
            filters = filterHash
            #4. get all of the sections from the mysql database
            mySql.getAll (results) ->
                #for dev purposes can take only a subset of results to work with only a part of the tree
                results = results#[0...500] #for faster loading/dev uncomment first part
                #5. initializes all of the packages
                #60 was chosen because the packages shouldn't exceed this number now, but you can always pick a higher number
                addPackages 60, () ->
                    #6. add all of the sections
                    addNodes results, ()->
                        if forView == true
                            #7. if it is for viewing, remove the blank packages
                            removeBlankPackages () ->
                                console.log "Obtained Tree -v"
                                callback tree
                        else
                            console.log "Obtained Tree"
                            callback tree
}

               
 
