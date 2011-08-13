(function() {
  var TermExtractor, Yql;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Yql = require("./yql");
  module.exports = TermExtractor = (function() {
    __extends(TermExtractor, Yql);
    function TermExtractor(limit) {
      TermExtractor.__super__.constructor.call(this, false, limit);
    }
    TermExtractor.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.q = 'select * from search.termextract where context="' + query + '"';
    };
    TermExtractor.prototype.getOutput = function(results) {
      return this.applyLimit(results.Result);
    };
    return TermExtractor;
  })();
}).call(this);
