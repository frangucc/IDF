(function() {
  var Google, HyperPhysics;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Google = require("./google");
  module.exports = HyperPhysics = (function() {
    __extends(HyperPhysics, Google);
    function HyperPhysics(limit) {
      HyperPhysics.__super__.constructor.call(this, limit);
      this.subjects.science = true;
      this.workerID = "hp";
      this.siteName = "HyperPhysics - Georgia State University";
    }
    HyperPhysics.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.q = query + " site:hyperphysics.phy-astr.gsu.edu";
    };
    return HyperPhysics;
  })();
}).call(this);
