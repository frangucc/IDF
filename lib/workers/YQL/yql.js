(function() {
  var Worker, Yql;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Worker = require("../worker");
  module.exports = Yql = (function() {
    __extends(Yql, Worker);
    function Yql(openTable, limit) {
      Yql.__super__.constructor.call(this, limit);
      this.requestOptions.host = "query.yahooapis.com";
      this.pathParts.base = "/v1/public/yql?";
      this.pathParts.options = {
        q: "",
        format: "json",
        diagnostics: "false",
        callback: ""
      };
      if (openTable !== false) {
        this.pathParts.options.env = "store://datatables.org/alltableswithkeys";
      }
      this.workerID = "yql";
      this.workerName = "Yahoo Query Language";
    }
    Yql.prototype.validateData = function(jsonData, callback) {
      var _ref;
      if (!((jsonData != null ? (_ref = jsonData.query) != null ? _ref.count : void 0 : void 0) != null)) {
        return callback("errorWithJSONObject", "");
      } else if (jsonData.query.count < 1) {
        return callback("no results", "");
      } else {
        return callback("true", this.getOutput(jsonData.query.results));
      }
    };
    return Yql;
  })();
}).call(this);
