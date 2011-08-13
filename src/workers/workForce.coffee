TermExtractor = require './YQL/termExtractor'
Youtube = require './YQL/youtube'
WolframMathWorld = require './Bing/wolframMathWorldBing'
HyperPhysics = require './Bing/hyperPhysicsBing'
Owl = require './Bing/owlBing'
Wikipedia = require './wikipedia'
Quizlet = require './quizlet'

#workforce is a group of bots that can preform mass searches
#the class is not a subclass of everything because it contains workers, it is not a worker

#the new workforce class (everything used by the new tree ui) takes in as input one section heading with its filters, and then tasks workers
module.exports = class WorkForce
    
    #the constructor sets up the workers objs
    #each time a worker is hired a new worker object is returned and called upon
    constructor: () ->

        @workerObjs = {
            youtube: {
                #the input to the hire function is the nubmer of results each worker should return
                hire: (n) ->
                    return new Youtube(n)
            }
            wmw: {
                hire: (n) ->
                    return new WolframMathWorld(n)
            }
            hp: {
                hire: (n) ->
                    return new HyperPhysics(n)
            }
            owl: {
                hire: (n) ->
                    return new Owl(n)
            }
            wikipedia: {
                hire: (n) ->
                    return new Wikipedia(n)
            }
            quizlet: {
                hire: (n) ->
                    return new Quizlet(n)
            }
        }
        
        #the use property of each worker is set to false intially
        #the defualt number of results is one
        for name, worker of @workerObjs
            worker.use = false
            worker.number = 1
        
        #youtube and quizlet are the only ones set to retrieve more than one result
        @workerObjs.youtube.number = 3
        @workerObjs.quizlet.number = 3
    
    #this function takes in the input array of filters and processes them for special filters
    manageSpecialFilters: (filterInput) ->
        #it starts a class variable called filters that is an array of all of the non-special filters
        @filters = "none"
        #workerFilter is a boolean that indicates whether there is a filter that specifies which workers to use
        workerFilter = false
        
        if filterInput != "none"
            @filters = new Array()
            console.log workerFilter
            for filter in filterInput
                text = filter.filter
                #if the filter is a special workers filter then each of the workers is told to be used depending on the state of the workers in the filter itself
                if text == "workers"
                    for worker, workerobj of @workerObjs
                        if filter[worker]?
                            if filter[worker]
                                @workerObjs[worker].use = true
                    workerFilter = true
                
                #if the filter is a special alt filter then the query term is set to the actual alternative text provided
                else if text[0...4] == "alt:"
                    if text[4] == ' '
                        @term = text[5..-1]
                    else
                        @term = text[4..-1]
                #if the filter is normal it is pushed onto the filters array
                else
                    @filters.push filter
        console.log workerFilter
        #if no special worker filter was present, then all the workers are used by default
        if !workerFilter
            for name, worker of @workerObjs
                worker.use = true
                    
    #this funciton takes the workername and compiles a query using the term and all of the filters that apply to that worker    
    compileQuery: (workerName) ->
        query = @term
        if @filters != "none"
            for filter in @filters
                if filter[workerName]
                    query+=" "
                    query+=filter.filter
        return query
    
    #this function handles results from a worker that actually contain content
    #it pushes the content to the back of the output array
    handleGoodOutput: (results) ->
        @count--
        for result in results
            @output.push result
        #IMPORTANT count is used to determine when the callback should be called
        #everytime a worker returns count is decreased until it is 0
        #count is initially set to the number of workers being tasked
        if @count == 0
            @callback @output
    #this function handles bad output by just logging the message that describes the output
    handleBadOutput: (msg) ->
        @count--
        
        console.log msg
        
        if @count == 0
            @callback @output
    #this is the real worker function, I will comment it step by step
    getContent: (term, filterInput, callback) ->
        #1. creates the instance variable workForce to hanle calls to this within the query callback
        workForce = @
        #2. this makes the class variable term equal to the name of the section 
        @term = term
        #3. this deals with all of the special filters and sets up the filters to be used by helper methods later
        @manageSpecialFilters filterInput
        
        #4. initializes the count, output, and class callback variables for access later
        @count = 0
        @output = new Array()
        @callback = callback
        
        #5. counts up how many workers are used to make sure the callback is triggered at the right time
        for workerName, worker of @workerObjs
            if worker.use
                @count++
        #6. commences loop through each of the workers in the workforce
        for workerName, worker of @workerObjs
            #only queries it if it is to be used
            if worker.use
                #7. hires a new worker of the current type
                myWorker = worker.hire(worker.number)
                #8. compiles the query with all of the filters
                query = @compileQuery workerName
                #9. queries the worker
                myWorker.query query, (valid, results) ->
                    #if there are vaild results it routes it to the goodoutput handler
                    if valid == "true"
                        workForce.handleGoodOutput results
                    else
                        workForce.handleBadOutput valid

#OLD

#here is the old way fo defining the work force class

#there are three functions in this OLD class
#1. extractTerms, this takes a string and a callback and returns all of the important terms using a termextractor worker
#2. getData, this takes an array of terms, a subject to be associated with the terms, and an action to be called when data is retrieved
#   this function will use all of the bots that pertain to the subject and pass the resutl to the action param
#3. extractTermsAndGetData, this function is just a compilation of the first two

    
    #the worker object contains all of the different kinds of workers
    #each value is a function that returns a new worker so taht each time it is called a new bot gets sent out to prevent problems with asynchronous calls
    #each constructor needs to be passed a limit value, this can be made dynamic later
    workers: {
        youtube: () ->
            return new Youtube(3)
        termExtract: () ->
            return new TermExtractor(2)
        wolframMW: () ->
            return new WolframMathWorld(1)
        hyperPhysics: () ->
            return new HyperPhysics(1)
        owl: () ->
            return new Owl(1)
        wikipedia: () ->
            return new Wikipedia(2)
    }
    
    #this function first extracts the terms, then feeds the terms into the get data function   
    extractTermsAndGetData: (text, subject, action) ->
        me = @
        @extractTerms text, (terms) ->
            me.getData terms, subject, action
    
    #this function creates a new term extractor and passes it the input text
    #it then passes the array of terms to the callback    
    extractTerms: (text, callback) ->
        @workers.termExtract().query text, (valid, terms)->
            if valid != "true"
                throw "error with extraction"
            callback terms
    
    #this function takes a group of terms and queries all of the workers relevant to the subject
    #the action is called everytime a query function returns with output
    #as of now there is not callback so there is not check on when this function finishes
    getDataMass: (terms, subject="generic", action) ->
        for term in terms
            for name, worker of @workers
                myWorker = worker()
                unless name == "termExtract"
                    if subject == "generic" || myWorker.subjects[subject] == true || myWorker.subjects.all == true
                        #console.log "***"+name+": "+term
                        myWorker.query term, (valid, results) ->
                            if valid == "true"
                                #console.log "valid"
                                for data in results
                                    action(data)
                            else
                                console.log valid
                                
                        
