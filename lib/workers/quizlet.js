(function() {
  var Quizlet, Worker;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Worker = require("./worker");
  module.exports = Quizlet = (function() {
    __extends(Quizlet, Worker);
    function Quizlet(limit) {
      Quizlet.__super__.constructor.call(this, limit);
      this.requestOptions.host = "api.quizlet.com";
      this.pathParts.base = "/1.0/sets?";
      this.pathParts.options = {
        dev_key: "YCffV6yVSwXsKWt9",
        q: "",
        per_page: limit,
        extended: "on"
      };
      this.workerID = "quizlet";
      this.siteName = "Quizlet Flash Cards";
      this.subjects.all = true;
    }
    Quizlet.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.q = query;
    };
    Quizlet.prototype.getOutput = function(results) {
      var output, result, _i, _len;
      output = new Array();
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        if (result.description === "") {
          result.description = "Flashcards about " + result.title;
        }
        output.push({
          title: result.title,
          content: result.description,
          author: result.creator,
          source: this.siteName,
          url: result.url,
          workerID: this.workerID,
          queryText: this.queryText
        });
      }
      return this.applyLimit(output);
    };
    Quizlet.prototype.validateData = function(jsonData, callback) {
      if (!((jsonData != null ? jsonData.response_type : void 0) != null)) {
        return callback("errorWithJSONObject", "");
      } else if (jsonData.response_type === "error") {
        return callback("no results", "");
      } else {
        return callback("true", this.getOutput(jsonData.sets));
      }
    };
    return Quizlet;
  })();
}).call(this);
