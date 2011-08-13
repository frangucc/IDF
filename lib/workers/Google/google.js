(function() {
  var Google, Worker;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Worker = require("../worker");
  module.exports = Google = (function() {
    __extends(Google, Worker);
    function Google(limit) {
      Google.__super__.constructor.call(this, limit);
      this.requestOptions.host = "ajax.googleapis.com";
      this.pathParts.base = "/ajax/services/search/web?";
      this.pathParts.options = {
        v: "1.0",
        q: ""
      };
      this.workerID = "google";
      this.siteName = "Google";
    }
    Google.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.q = query;
    };
    Google.prototype.getOutput = function(results) {
      var output, result, _i, _len;
      output = new Array();
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        output.push({
          title: result.titleNoFormatting,
          content: result.content,
          author: this.siteName,
          source: this.siteName,
          url: result.url,
          workerID: this.workerID,
          queryText: this.queryText
        });
      }
      return this.applyLimit(output);
    };
    Google.prototype.validateData = function(jsonData, callback) {
      var _ref;
      if (!((jsonData != null ? (_ref = jsonData.responseData) != null ? _ref.results : void 0 : void 0) != null)) {
        console.log(jsonData);
        return callback("errorWithJSONObject", "");
      } else if (jsonData.responseData.results.length < 1) {
        return callback("no results", "");
      } else {
        return callback("true", this.getOutput(jsonData.responseData.results));
      }
    };
    return Google;
  })();
}).call(this);
