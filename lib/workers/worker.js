(function() {
  var Worker, eyes, http, queryString;
  queryString = require("querystring");
  http = require("http");
  eyes = require("eyes");
  module.exports = Worker = (function() {
    function Worker(limit) {
      if (limit == null) {
        limit = 5;
      }
      this.requestOptions = {
        host: "",
        port: 80,
        path: "",
        headers: {
          "user-agent": "BenchPrep content augmentation client contact @ chicago@benchprep.com"
        }
      };
      this.pathParts = {
        base: "",
        options: {}
      };
      this.subjects = {
        math: false,
        science: false,
        english: false,
        writing: false,
        all: false
      };
      this.limit = limit;
      this.workerID = "worker";
      this.workerName = "Worker";
    }
    Worker.prototype.query = function(query, callback) {
      var req, worker;
      worker = this;
      this.queryText = query;
      this.callback = callback;
      this.enterQueryinPath(this.shortenQuery(query));
      this.requestOptions.path = this.pathParts.base + queryString.stringify(this.pathParts.options);
      return req = http.get(this.requestOptions, function(response) {
        var text;
        text = "";
        response.on("data", function(data) {
          return text += data;
        });
        return response.on("end", function() {
          var jsonData, message;
          try {
            jsonData = eval('(' + text + ')');
            worker.error = false;
          } catch (e) {
            message = "not valid JSON" + "-" + worker.workerID;
            console.log(text);
            worker.error = true;
            worker.callback(message, "");
          }
          if (worker.error === false) {
            return worker.validateData(jsonData, function(valid, outputData) {
              worker.output = outputData;
              if (valid === "true") {
                return worker.callback("true", outputData);
              } else {
                message = valid + "-" + worker.workerID;
                return worker.callback(message, "");
              }
            });
          }
        });
      });
    };
    Worker.prototype.enterQueryinPath = function() {};
    Worker.prototype.validateData = function(jsonData, callback) {};
    Worker.prototype.getOutput = function() {};
    Worker.prototype.applyLimit = function(output) {
      if (this.limit < 1) {
        return output.slice(0, 1);
      }
      return output.slice(0, this.limit);
    };
    Worker.prototype.shortenQuery = function(query) {
      var shortQuery, word, _i, _len, _ref;
      shortQuery = "";
      _ref = query.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        word = _ref[_i];
        if (!/[0-9]/.test(word)) {
          shortQuery += word;
          shortQuery += " ";
        }
      }
      if (shortQuery.length === 0) {
        return query;
      } else {
        return shortQuery.substring(0, shortQuery.length - 1);
      }
    };
    return Worker;
  })();
}).call(this);
