(function() {
  var Bing, WolframMathWorld;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Bing = require("./bing");
  module.exports = WolframMathWorld = (function() {
    __extends(WolframMathWorld, Bing);
    function WolframMathWorld(limit) {
      WolframMathWorld.__super__.constructor.call(this, limit);
      this.subjects.math = true;
      this.workerID = "wmw";
      this.siteName = "Wolfram MathWorld";
    }
    WolframMathWorld.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.query = query + " site:mathworld.wolfram.com";
    };
    return WolframMathWorld;
  })();
}).call(this);
