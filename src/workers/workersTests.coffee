#an attempt at using vows to do test based development

#THE TESTS WILL NOT WORK WITHOUT SIGNIFICANT DEBUGGING


TermExtractor = require './workers/termExtractor'
Youtube = require './workers/youtube'
WolframMathWorld = require './workers/wolframMathWorld'
HyperPhysics = require './workers/hyperPhysics'
Owl = require './workers/owl'
Wikipedia = require './workers/wikipedia'
Worker = require './workers/worker'
Database = require './utilities/database'
#FileReader = require './utilities/fileReader'
#HtmlStripper = require './utilities/htmlStripper'
vows = require "vows/lib/vows"
assert = require "assert"

workers = {
#    youtube: () ->
#        return new Youtube(1)
#    wolframMW: () ->
#        return new WolframMathWorld(1)
#    hyperPhysics: () ->
#        return new HyperPhysics(1)
#    owl: () ->
#        return new Owl(1)
    wikipedia: () ->
        return new Wikipedia(1)
}
suite = vows.describe "workers"

for name, worker of workers
    batch = {}
    batch[name] = 
            topic: worker()
           
            "should be an instance of worker": (worker) ->
                assert.instanceOf worker, Worker
                
            "should contain a default limit value": (worker) ->
                assert.isNumber worker.limit
            
            "should have a worker id that is a string and not the default": (worker) ->
                assert.isString worker.workerID
                assert.notEqual(worker.workerID, "worker")
            
            "should have a worker name that is a string and not the default": (worker) ->
                assert.isString worker.workerName
                assert.notEqual(worker.workerNlame, "Worker")
                
            "should have all necessary functions": (worker) ->
                assert.isFunction worker.query
                assert.isFunction worker.enterQueryinPath
                assert.isFunction worker.validateData
                assert.isFunction worker.getOutput
                assert.isFunction worker.applyLimit
            
            "applyLimit": {                
                "should take the array of output values and cut out values so that it meets the output limit": (worker) ->
                    worker.limit = 3
                    assert.deepEqual worker.applyLimit([5,4,3,2]), [5,4,3]
                
                "should assume that a limit of 0 is really a limit of one": (worker) ->
                    worker.limit = 0
                    assert.deepEqual worker.applyLimit([5,4,3,2]), [5]
                
                "should take an overlimit as a sign to return the whole array": (worker) ->
                    worker.limit = 6
                    assert.deepEqual worker.applyLimit([5,4,3,2]), [5,4,3,2]
            }
            
            "query (triangles)": {
                topic: (worker) ->
                    root = global ? window
                    root.cback = this.callback
                    
                    worker.query "triangles", (valid, output) ->
                       #if valid != "true" && valid != "no results"
                       #     root.cback "there was an error"
                       # else if valid == "no results"
                       #     root.cback valid
                       # else
                       root.cback worker                
                    
                    return undefined
                    
                "non-empty output should have a title, url, author, source, workerID, and queryText": (worker) ->
                    console.log arguments
            }
                
    suite.addBatch batch

suite.run()
