(function() {
  var Client, Eyes, MySql, client, connect, database, query, tableA, tableC, tableO;
  Client = require('mysql').Client;
  Eyes = require('eyes');
  client = new Client();
  database = "benchprep";
  tableC = "IDF_Components";
  tableA = "IDF_Associations";
  tableO = "IDF_Objects";
  client.user = "user";
  client.password = "password";
  client.host = "localhost";
  connect = function(callback) {
    return client.query("USE " + database, function(err, results, fields) {
      if (err) {
        throw err;
      } else {
        return callback(true);
      }
    });
  };
  query = function(queryText, callback) {
    return client.query(queryText, function(err, results, fields) {
      if (err) {
        throw err;
      }
      return callback(results, fields);
    });
  };
  module.exports = MySql = (function() {
    function MySql() {}
    MySql.prototype.getIDFComponents = function(callback) {
      return connect(function() {
        var queryText;
        queryText = "SELECT id, name FROM " + tableC;
        return query(queryText, function(results) {
          if (results.length < 1) {
            console.log("no results");
          }
          return callback(results);
        });
      });
    };
    MySql.prototype.insertIDFComponent = function(name, callback) {
      return connect(function() {
        var queryText;
        queryText = "INSERT INTO " + tableC + " (name) VALUES ('" + name + "')";
        return query(queryText, function() {
          return callback(true);
        });
      });
    };
    MySql.prototype.renameIDFComponent = function(id, newName, callback) {
      return connect(function() {
        var queryText;
        queryText = "UPDATE " + tableC + " SET name='" + newName + "' WHERE id=" + id;
        return query(queryText, function() {
          return callback(true);
        });
      });
    };
    MySql.prototype.deleteIDFComponent = function(id, callback) {
      return connect(function() {
        var queryText;
        queryText = "DELETE FROM " + tableC + " WHERE id=" + id;
        return query(queryText, function() {
          return callback(true);
        });
      });
    };
    MySql.prototype.getAssociationsForPackage = function(packageId, callback) {
      return connect(function() {
        var queryText;
        queryText = "SELECT * FROM " + tableA + " WHERE packageId=" + packageId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    MySql.prototype.getAssociationsForPackageWithComponent = function(packageId, callback) {
      return connect(function() {
        var queryText;
        queryText = "SELECT a.id, a.type, a.name, c.name AS component ";
        queryText += "FROM " + tableA + " a ";
        queryText += "INNER JOIN " + tableC + " c ";
        queryText += "ON a.componentId = c.id ";
        queryText += "WHERE a.packageId=" + packageId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    MySql.prototype.getAssociationsForIDFComponent = function(componentId, callback) {
      return connect(function() {
        var queryText;
        queryText = "Select * FROM " + tableA + " WHERE componentId=" + componentId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    MySql.prototype.insertAssociation = function(packageId, type, name, componentId, callback) {
      return connect(function() {
        var queryText;
        queryText = "INSERT INTO " + tableA + " (packageId, type, name, componentId) ";
        queryText += "VALUES (" + packageId + ", '" + type + "', '" + name + "', " + componentId + ")";
        return query(queryText, function() {
          return callback(true);
        });
      });
    };
    MySql.prototype.deleteAssociation = function(id, callback) {
      return connect(function() {
        var queryText;
        queryText = "DELETE FROM " + tableA + " WHERE id=" + id;
        return query(queryText, function() {
          return callback(true);
        });
      });
    };
    MySql.prototype.getObjectsForSection = function(sectionId, callback) {
      return connect(function() {
        var queryText;
        queryText = "SELECT * FROM " + tableO + " WHERE sectionId=" + sectionId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    MySql.prototype.getObjectsForSectionWithComponent = function(sectionId, callback) {
      return connect(function() {
        var queryText;
        queryText = "SELECT * FROM " + tableO + " WHERE sectionId=" + sectionId;
        queryText = "SELECT o.id, o.packageId, o.sectionId, o.componentId, o.content, o.parentId, o.tag, c.name AS component ";
        queryText += "FROM " + tableO + " o ";
        queryText += "INNER JOIN " + tableC + " c ";
        queryText += "ON o.componentId = c.id ";
        queryText += "WHERE o.sectionId=" + sectionId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    MySql.prototype.getOjectsForSectionByType = function(sectionId, componentId) {
      return connect(function() {
        var queryText;
        queryText = "SELECT * FROM " + tableO + " WHERE sectionId=" + sectionId + " AND componentId=" + componentId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    MySql.prototype.insertObject = function(options, callback) {
      return connect(function() {
        var queryText;
        queryText = "INSERT INTO " + tableO + " (packageId, sectionId, componentId, content, parentId, tag) ";
        queryText += "VALUES (" + options.packageId + ", " + options.sectionId + ", " + options.componentId + ", '" + options.content + "', " + options.parentId + ", '" + options.tag + "')";
        return query(queryText, function(results, fields) {
          return callback(results.insertId);
        });
      });
    };
    MySql.prototype.clearObjects = function(callback) {
      return connect(function() {
        var queryText;
        queryText = "DELETE FROM " + tableO;
        return query(queryText, function(results, fields) {
          return callback(true);
        });
      });
    };
    MySql.prototype.deleteObject = function(id, callback) {
      return connect(function() {
        var queryText;
        queryText = "DELETE FROM " + tableO + " WHERE id=" + id;
        return query(queryText, function() {
          return callback(true);
        });
      });
    };
    MySql.prototype.getHTMLFilesForPackage = function(packageId, callback) {
      return conenct(function() {
        var queryText;
        queryText = "SELECT content_package_id, html_file FROM readings WHERE content_package_id=" + packageId;
        return query(queryText, function(results) {
          return callback(results);
        });
      });
    };
    return MySql;
  })();
}).call(this);
