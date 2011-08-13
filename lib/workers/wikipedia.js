(function() {
  var Wikipedia, Worker;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Worker = require("./worker");
  module.exports = Wikipedia = (function() {
    __extends(Wikipedia, Worker);
    function Wikipedia(limit) {
      Wikipedia.__super__.constructor.call(this, limit);
      this.requestOptions.host = "en.wikipedia.org";
      this.pathParts.base = "/w/api.php?";
      this.pathParts.options = {
        action: "opensearch",
        search: "",
        format: "json",
        limit: limit
      };
      this.workerID = "wikipedia";
      this.siteName = "Wikipedia.org";
      this.subjects.all = true;
    }
    Wikipedia.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.search = query;
    };
    Wikipedia.prototype.getOutput = function(results) {
      var output, result, _i, _len;
      output = new Array();
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        output.push({
          title: result,
          author: this.siteName,
          source: this.siteName,
          url: "http://en.wikipedia.org/wiki/" + result,
          workerID: this.workerID,
          queryText: this.queryText
        });
      }
      return this.applyLimit(output);
    };
    Wikipedia.prototype.validateData = function(jsonData, callback) {
      if (!((jsonData != null ? jsonData[1] : void 0) != null)) {
        return callback("errorWithJSONObject", "");
      } else if (jsonData[1].length < 1) {
        return callback("no results", "");
      } else {
        return callback("true", this.getOutput(jsonData[1]));
      }
    };
    return Wikipedia;
  })();
}).call(this);
