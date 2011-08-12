fs = require "fs"

{spawn, exec} = require 'child_process'

compile = ->
    console.log "Compiling"
    
    options = ['-cw', '-o', './lib/', './src/']
    
    compiling = spawn 'coffee', options
    
    compiling.stdout.on 'data', (data) ->
        console.log data.toString()


task 'watcher', 'watcher function', ->
    compile()
