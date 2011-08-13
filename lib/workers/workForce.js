(function() {
  var HyperPhysics, Owl, Quizlet, TermExtractor, Wikipedia, WolframMathWorld, WorkForce, Youtube;
  TermExtractor = require('./YQL/termExtractor');
  Youtube = require('./YQL/youtube');
  WolframMathWorld = require('./Bing/wolframMathWorldBing');
  HyperPhysics = require('./Bing/hyperPhysicsBing');
  Owl = require('./Bing/owlBing');
  Wikipedia = require('./wikipedia');
  Quizlet = require('./quizlet');
  module.exports = WorkForce = (function() {
    function WorkForce() {
      var name, worker, _ref;
      this.workerObjs = {
        youtube: {
          hire: function(n) {
            return new Youtube(n);
          }
        },
        wmw: {
          hire: function(n) {
            return new WolframMathWorld(n);
          }
        },
        hp: {
          hire: function(n) {
            return new HyperPhysics(n);
          }
        },
        owl: {
          hire: function(n) {
            return new Owl(n);
          }
        },
        wikipedia: {
          hire: function(n) {
            return new Wikipedia(n);
          }
        },
        quizlet: {
          hire: function(n) {
            return new Quizlet(n);
          }
        }
      };
      _ref = this.workerObjs;
      for (name in _ref) {
        worker = _ref[name];
        worker.use = false;
        worker.number = 1;
      }
      this.workerObjs.youtube.number = 3;
      this.workerObjs.quizlet.number = 3;
    }
    WorkForce.prototype.manageSpecialFilters = function(filterInput) {
      var filter, name, text, worker, workerFilter, workerobj, _i, _len, _ref, _ref2, _results;
      this.filters = "none";
      workerFilter = false;
      if (filterInput !== "none") {
        this.filters = new Array();
        console.log(workerFilter);
        for (_i = 0, _len = filterInput.length; _i < _len; _i++) {
          filter = filterInput[_i];
          text = filter.filter;
          if (text === "workers") {
            _ref = this.workerObjs;
            for (worker in _ref) {
              workerobj = _ref[worker];
              if (filter[worker] != null) {
                if (filter[worker]) {
                  this.workerObjs[worker].use = true;
                }
              }
            }
            workerFilter = true;
          } else if (text.slice(0, 4) === "alt:") {
            if (text[4] === ' ') {
              this.term = text.slice(5);
            } else {
              this.term = text.slice(4);
            }
          } else {
            this.filters.push(filter);
          }
        }
      }
      console.log(workerFilter);
      if (!workerFilter) {
        _ref2 = this.workerObjs;
        _results = [];
        for (name in _ref2) {
          worker = _ref2[name];
          _results.push(worker.use = true);
        }
        return _results;
      }
    };
    WorkForce.prototype.compileQuery = function(workerName) {
      var filter, query, _i, _len, _ref;
      query = this.term;
      if (this.filters !== "none") {
        _ref = this.filters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (filter[workerName]) {
            query += " ";
            query += filter.filter;
          }
        }
      }
      return query;
    };
    WorkForce.prototype.handleGoodOutput = function(results) {
      var result, _i, _len;
      this.count--;
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        this.output.push(result);
      }
      if (this.count === 0) {
        return this.callback(this.output);
      }
    };
    WorkForce.prototype.handleBadOutput = function(msg) {
      this.count--;
      console.log(msg);
      if (this.count === 0) {
        return this.callback(this.output);
      }
    };
    WorkForce.prototype.getContent = function(term, filterInput, callback) {
      var myWorker, query, workForce, worker, workerName, _ref, _ref2, _results;
      workForce = this;
      this.term = term;
      this.manageSpecialFilters(filterInput);
      this.count = 0;
      this.output = new Array();
      this.callback = callback;
      _ref = this.workerObjs;
      for (workerName in _ref) {
        worker = _ref[workerName];
        if (worker.use) {
          this.count++;
        }
      }
      _ref2 = this.workerObjs;
      _results = [];
      for (workerName in _ref2) {
        worker = _ref2[workerName];
        _results.push(worker.use ? (myWorker = worker.hire(worker.number), query = this.compileQuery(workerName), myWorker.query(query, function(valid, results) {
          if (valid === "true") {
            return workForce.handleGoodOutput(results);
          } else {
            return workForce.handleBadOutput(valid);
          }
        })) : void 0);
      }
      return _results;
    };
    WorkForce.prototype.workers = {
      youtube: function() {
        return new Youtube(3);
      },
      termExtract: function() {
        return new TermExtractor(2);
      },
      wolframMW: function() {
        return new WolframMathWorld(1);
      },
      hyperPhysics: function() {
        return new HyperPhysics(1);
      },
      owl: function() {
        return new Owl(1);
      },
      wikipedia: function() {
        return new Wikipedia(2);
      }
    };
    WorkForce.prototype.extractTermsAndGetData = function(text, subject, action) {
      var me;
      me = this;
      return this.extractTerms(text, function(terms) {
        return me.getData(terms, subject, action);
      });
    };
    WorkForce.prototype.extractTerms = function(text, callback) {
      return this.workers.termExtract().query(text, function(valid, terms) {
        if (valid !== "true") {
          throw "error with extraction";
        }
        return callback(terms);
      });
    };
    WorkForce.prototype.getDataMass = function(terms, subject, action) {
      var myWorker, name, term, worker, _i, _len, _results;
      if (subject == null) {
        subject = "generic";
      }
      _results = [];
      for (_i = 0, _len = terms.length; _i < _len; _i++) {
        term = terms[_i];
        _results.push((function() {
          var _ref, _results2;
          _ref = this.workers;
          _results2 = [];
          for (name in _ref) {
            worker = _ref[name];
            myWorker = worker();
            _results2.push(name !== "termExtract" ? subject === "generic" || myWorker.subjects[subject] === true || myWorker.subjects.all === true ? myWorker.query(term, function(valid, results) {
              var data, _j, _len2, _results3;
              if (valid === "true") {
                _results3 = [];
                for (_j = 0, _len2 = results.length; _j < _len2; _j++) {
                  data = results[_j];
                  _results3.push(action(data));
                }
                return _results3;
              } else {
                return console.log(valid);
              }
            }) : void 0 : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    return WorkForce;
  })();
}).call(this);
