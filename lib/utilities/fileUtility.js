(function() {
  var FileUtility, fs;
  fs = require("fs");
  module.exports = FileUtility = (function() {
    function FileUtility() {}
    FileUtility.prototype.readFile = function(filePath, callback) {
      return fs.readFile(filePath, function(error, data) {
        if (error) {
          console.log("Error in file reader");
          throw error;
        }
        return callback(data);
      });
    };
    FileUtility.prototype.stripHTML = function(text, callback) {
      var plainText;
      plainText = String(text).replace(/(<([^>]+)>)/ig, "");
      return callback(plainText);
    };
    FileUtility.prototype.readAndStripHTML = function(filePath, callback) {
      var me;
      me = this;
      return this.readFile(filePath, function(data) {
        return me.stripHTML(data, function(plainText) {
          return callback(plainText);
        });
      });
    };
    return FileUtility;
  })();
}).call(this);
