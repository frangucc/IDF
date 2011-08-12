(function() {
  var MySql, eyes, fs, handler, jsdom, mySql, readFile, zombie;
  zombie = require("zombie");
  eyes = require("eyes");
  jsdom = require("jsdom");
  MySql = require("./database");
  mySql = new MySql();
  fs = require("fs");
  readFile = function(filePath, callback) {
    var encoding;
    return fs.readFile(filePath, encoding = 'utf8', function(error, data) {
      if (error) {
        console.log("Error in file reader");
        throw error;
      }
      return callback(data);
    });
  };
  handler = function() {
    /*
        filePath = "../public/triangles.html"
        readFile filePath, (html) ->
            jsdom.env html, ['http://code.jquery.com/jquery-1.5.min.js'], (errors, window) ->
                getClassesIdsTags window.$("body")[0]
                console.log classes
                console.log ids
                console.log tags
        */    return mySql.insertObject(80, 81, 82, "content", 0, "a", function() {});
  };
  handler();
  /*
  exports.display = (res, callback) ->
      url = "http://localhost:3000/15/roots.html"
      zombie.visit url, (err, browser) ->
          console.log browser.text("title")
          equations = browser.css ".equation"
          console.log equations.length
          
          callback res, equations[0]
  
  classes = new Object()
  ids = new Object()
  tags = new Object()
  
  getClassesIdsTags = (node) ->
  
      if node?.className?.length? && node.className.length > 0
          classArray = node.className.split(' ')
          for classA in classArray
              classes[classA] = true
      
      if node?.id?.length? && node.id.length > 0
          ids[node.id] = true
      
      if node?._tagName?.length?
          tags[node._tagName] = true
      
      if node._childNodes?.length? > 0
          for child in node._childNodes
              getClassesIdsTags child
  
          
  url = "http://localhost:3000/15/roots.html"
  #url = "http://localhost:3000/testHTML.html"
  zombie.visit url, (err, browser) ->
      if err
          throw err
      #equations = browser.css ".equation"
      getClassesIdsTags browser.body
      console.log classes
      console.log ids
      console.log tags
  */
}).call(this);
