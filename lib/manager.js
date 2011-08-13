(function() {
  var MySql, WorkForce, filterDb, mySql, workForce;
  MySql = require('./utilities/mySqlDatabase');
  mySql = new MySql();
  WorkForce = require('./workers/workForce');
  workForce = new WorkForce();
  filterDb = require('./filterInterface/filterDatabase');
  exports.liveQuery = function(name, id, res, callback) {
    return filterDb.getDBbyID(function(filterHash) {
      var filters, _ref;
      if ((((_ref = filterHash[id]) != null ? _ref.length : void 0) != null) > 0) {
        filters = filterHash[id];
      } else {
        filters = "none";
      }
      return workForce.getContent(name, filters, function(results) {
        var result, workerOutput, _i, _len;
        workerOutput = new Object();
        if (results.length > 0) {
          for (_i = 0, _len = results.length; _i < _len; _i++) {
            result = results[_i];
            if (!(workerOutput[result.workerID] != null)) {
              workerOutput[result.workerID] = new Array();
            }
            workerOutput[result.workerID].push(result);
          }
          return callback(workerOutput);
        } else {
          return callback("no results");
        }
      });
    });
  };
  exports.getComponents = function(callback) {
    return mySql.getIDFComponents(function(results) {
      return callback(results);
    });
  };
  exports.handleComponentsForm = function(submission, callback) {
    var functionCall;
    functionCall = function(callback) {
      return callback();
    };
    switch (submission.action) {
      case "new":
        functionCall = function(callback) {
          return mySql.insertIDFComponent(submission.name, function() {
            return callback(true);
          });
        };
        break;
      case "rename":
        functionCall = function(callback) {
          return mySql.renameIDFComponent(submission.componentId, submission.name, function() {
            return callback(true);
          });
        };
        break;
      case "delete":
        functionCall = function(callback) {
          return mySql.deleteIDFComponent(submission.componentId, function() {
            return callback(true);
          });
        };
    }
    return functionCall(function() {
      return callback(true);
    });
  };
  exports.handleAssociationForm = function(submission, callback) {
    var name, type;
    type = "none";
    if (submission.classes !== "none") {
      type = "class";
      name = submission.classes;
    }
    if (submission.tags !== "none") {
      type = "tag";
      name = submission.tags;
    }
    if (submission.ids !== "none") {
      type = "id";
      name = submission.ids;
    }
    return mySql.insertAssociation(submission.packageId, type, name, submission.componentId, function() {
      return callback(true);
    });
  };
  exports.getAssociationsAndComponents = function(packageId, callback) {
    return mySql.getAssociationsForPackageWithComponent(packageId, function(associations) {
      return callback(associations);
    });
  };
  exports.handleAssociationRemovalForm = function(submission, callback) {
    return mySql.deleteAssociation(submission.association, function() {
      return callback(true);
    });
  };
}).call(this);
