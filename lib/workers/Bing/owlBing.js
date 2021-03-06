(function() {
  var Bing, Owl;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Bing = require("./bing");
  module.exports = Owl = (function() {
    __extends(Owl, Bing);
    function Owl(limit) {
      Owl.__super__.constructor.call(this, limit);
      this.subjects.english = true;
      this.subjects.writing = true;
      this.workerID = "owl";
      this.siteName = "OWL - The Purdue Online Writing Lab";
    }
    Owl.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.query = query + " site:owl.english.purdue.edu";
    };
    return Owl;
  })();
}).call(this);
