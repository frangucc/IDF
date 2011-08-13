(function() {
  var Database, HyperPhysics, Owl, TermExtractor, Wikipedia, WolframMathWorld, Worker, Youtube, assert, batch, name, suite, vows, worker, workers;
  TermExtractor = require('./workers/termExtractor');
  Youtube = require('./workers/youtube');
  WolframMathWorld = require('./workers/wolframMathWorld');
  HyperPhysics = require('./workers/hyperPhysics');
  Owl = require('./workers/owl');
  Wikipedia = require('./workers/wikipedia');
  Worker = require('./workers/worker');
  Database = require('./utilities/database');
  vows = require("vows/lib/vows");
  assert = require("assert");
  workers = {
    wikipedia: function() {
      return new Wikipedia(1);
    }
  };
  suite = vows.describe("workers");
  for (name in workers) {
    worker = workers[name];
    batch = {};
    batch[name] = {
      topic: worker(),
      "should be an instance of worker": function(worker) {
        return assert.instanceOf(worker, Worker);
      },
      "should contain a default limit value": function(worker) {
        return assert.isNumber(worker.limit);
      },
      "should have a worker id that is a string and not the default": function(worker) {
        assert.isString(worker.workerID);
        return assert.notEqual(worker.workerID, "worker");
      },
      "should have a worker name that is a string and not the default": function(worker) {
        assert.isString(worker.workerName);
        return assert.notEqual(worker.workerNlame, "Worker");
      },
      "should have all necessary functions": function(worker) {
        assert.isFunction(worker.query);
        assert.isFunction(worker.enterQueryinPath);
        assert.isFunction(worker.validateData);
        assert.isFunction(worker.getOutput);
        return assert.isFunction(worker.applyLimit);
      },
      "applyLimit": {
        "should take the array of output values and cut out values so that it meets the output limit": function(worker) {
          worker.limit = 3;
          return assert.deepEqual(worker.applyLimit([5, 4, 3, 2]), [5, 4, 3]);
        },
        "should assume that a limit of 0 is really a limit of one": function(worker) {
          worker.limit = 0;
          return assert.deepEqual(worker.applyLimit([5, 4, 3, 2]), [5]);
        },
        "should take an overlimit as a sign to return the whole array": function(worker) {
          worker.limit = 6;
          return assert.deepEqual(worker.applyLimit([5, 4, 3, 2]), [5, 4, 3, 2]);
        }
      },
      "query (triangles)": {
        topic: function(worker) {
          var root;
          root = typeof global !== "undefined" && global !== null ? global : window;
          root.cback = this.callback;
          worker.query("triangles", function(valid, output) {
            return root.cback(worker);
          });
        },
        "non-empty output should have a title, url, author, source, workerID, and queryText": function(worker) {
          return console.log(arguments);
        }
      }
    };
    suite.addBatch(batch);
  }
  suite.run();
}).call(this);
