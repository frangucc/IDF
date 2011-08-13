(function() {
  var Youtube, Yql;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Yql = require("./yql");
  module.exports = Youtube = (function() {
    __extends(Youtube, Yql);
    function Youtube(limit) {
      Youtube.__super__.constructor.call(this, true, limit);
      this.subjects.all = true;
      this.workerID = "youtube";
      this.siteName = "Youtube";
    }
    Youtube.prototype.enterQueryinPath = function(query) {
      return this.pathParts.options.q = 'select * from youtube.search where query="' + query + '"';
    };
    Youtube.prototype.getOutput = function(results) {
      var output, video, _i, _len, _ref;
      output = new Array();
      _ref = results.video;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        video = _ref[_i];
        output.push({
          title: video.title,
          content: video.content,
          author: video.author,
          source: this.siteName,
          url: video.url,
          workerID: this.workerID,
          queryText: this.queryText
        });
      }
      return this.applyLimit(output);
    };
    return Youtube;
  })();
}).call(this);
