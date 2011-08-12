(function() {
  var MySql, mySql;
  MySql = require('./database');
  mySql = new MySql();
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