(function() {
  var Bing, Worker;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Worker = require("../worker");
  module.exports = Bing = (function() {
    __extends(Bing, Worker);
    function Bing(limit) {
      Bing.__super__.constructor.call(this, limit);
      this.requestOptions.host = "api.bing.net";
      this.pathParts.base = "/json.aspx?";
      this.pathParts.options = {
        appid: "9281FFC2A1A9926DFD374D32CA26EA3D8175869C",
        version: "2.2",
        market: "en-us",
        query: "",
        sources: "web",
        "web.count": limit
      };
      this.workerID = "bing";
      this.siteName = "Bing.com";
    }
    Bing.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.query = query;
    };
    Bing.prototype.getOutput = function(results) {
      var output, result, _i, _len;
      output = new Array();
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        output.push({
          title: result.Title,
          content: result.Description,
          author: this.siteName,
          source: this.siteName,
          url: result.Url,
          workerID: this.workerID,
          queryText: this.queryText
        });
      }
      return this.applyLimit(output);
    };
    Bing.prototype.validateData = function(jsonData, callback) {
      var _ref, _ref2;
      if (!((jsonData != null ? (_ref = jsonData.SearchResponse) != null ? (_ref2 = _ref.Web) != null ? _ref2.Total : void 0 : void 0 : void 0) != null)) {
        console.log(jsonData);
        return callback("errorWithJSONObject", "");
      } else if (jsonData.SearchResponse.Web.Total === 0) {
        return callback("no results", "");
      } else {
        return callback("true", this.getOutput(jsonData.SearchResponse.Web.Results));
      }
    };
    return Bing;
  })();
}).call(this);
