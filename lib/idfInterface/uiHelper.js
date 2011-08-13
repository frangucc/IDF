(function() {
  var Eyes, MySql, classes, fs, getClassesIdsTags, ids, insertIDFObjects, jsdom, mySql, readFile, tags;
  jsdom = require("jsdom");
  fs = require("fs");
  MySql = require("../utilities/mySqlDatabase");
  mySql = new MySql();
  Eyes = require("eyes");
  classes = new Object();
  ids = new Object();
  tags = new Object();
  readFile = function(filePath, callback) {
    var encoding;
    return fs.readFile(filePath, encoding = 'utf8', function(error, data) {
      if (error) {
        console.log("Error in file reader");
        throw error;
      }
      return callback(data);
    });
  };
  getClassesIdsTags = function(node) {
    var child, classA, classArray, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4, _ref5, _results;
    if (((node != null ? (_ref = node.className) != null ? _ref.length : void 0 : void 0) != null) && node.className.length > 0) {
      classArray = node.className.split(' ');
      for (_i = 0, _len = classArray.length; _i < _len; _i++) {
        classA = classArray[_i];
        classes[classA] = true;
      }
    }
    if (((node != null ? (_ref2 = node.id) != null ? _ref2.length : void 0 : void 0) != null) && node.id.length > 0) {
      ids[node.id] = true;
    }
    if ((node != null ? (_ref3 = node._tagName) != null ? _ref3.length : void 0 : void 0) != null) {
      if (node._tagName !== "body") {
        tags[node._tagName] = true;
      }
    }
    if ((((_ref4 = node._childNodes) != null ? _ref4.length : void 0) != null) > 0) {
      _ref5 = node._childNodes;
      _results = [];
      for (_j = 0, _len2 = _ref5.length; _j < _len2; _j++) {
        child = _ref5[_j];
        _results.push(getClassesIdsTags(child));
      }
      return _results;
    }
  };
  insertIDFObjects = function(node, parent, associationObj) {
    var child, classA, classArray, component, content, isIDFObject, lastObject, options, properties, property, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _results;
    isIDFObject = false;
    properties = new Array();
    if (((node != null ? (_ref = node.id) != null ? _ref.length : void 0 : void 0) != null) && node.id.length > 0) {
      properties.push({
        name: node.id,
        type: "id"
      });
    }
    if (((node != null ? (_ref2 = node.className) != null ? _ref2.length : void 0 : void 0) != null) && node.className.length > 0) {
      classArray = node.className.split(' ');
      for (_i = 0, _len = classArray.length; _i < _len; _i++) {
        classA = classArray[_i];
        properties.push({
          name: classA,
          type: "class"
        });
      }
    }
    if ((node != null ? (_ref3 = node._tagName) != null ? _ref3.length : void 0 : void 0) != null) {
      properties.push({
        name: node._tagName,
        type: "tag"
      });
    }
    for (_j = 0, _len2 = properties.length; _j < _len2; _j++) {
      property = properties[_j];
      if ((((_ref4 = associationObj[property.type]) != null ? (_ref5 = _ref4[property.name]) != null ? _ref5.length : void 0 : void 0) != null) > 0) {
        _ref6 = associationObj[property.type][property.name];
        for (_k = 0, _len3 = _ref6.length; _k < _len3; _k++) {
          component = _ref6[_k];
          content = "";
          if ((node.innerHTML != null) && node.outerHTML !== "") {
            content = node.outerHTML;
          } else if ((node.src != null) && node.src !== "") {
            content = node.src;
          }
          options = new Object();
          options = {
            sectionId: associationObj.sectionId,
            packageId: associationObj.packageId,
            componentId: component,
            content: content,
            parentId: parent,
            tag: node._tagName
          };
          if (isIDFObject === false) {
            lastObject = options;
            isIDFObject = true;
          } else {
            mySql.insertObject(options, function() {});
          }
        }
      }
    }
    if (isIDFObject) {
      return mySql.insertObject(lastObject, function(newParentId) {
        var child, _l, _len4, _ref7, _ref8, _results;
        if ((((_ref7 = node._childNodes) != null ? _ref7.length : void 0) != null) > 0) {
          _ref8 = node._childNodes;
          _results = [];
          for (_l = 0, _len4 = _ref8.length; _l < _len4; _l++) {
            child = _ref8[_l];
            _results.push(insertIDFObjects(child, newParentId, associationObj));
          }
          return _results;
        }
      });
    } else {
      if ((((_ref7 = node._childNodes) != null ? _ref7.length : void 0) != null) > 0) {
        _ref8 = node._childNodes;
        _results = [];
        for (_l = 0, _len4 = _ref8.length; _l < _len4; _l++) {
          child = _ref8[_l];
          _results.push(insertIDFObjects(child, parent, associationObj));
        }
        return _results;
      }
    }
  };
  exports.getProperties = function(res, url, callback) {
    classes = new Object();
    ids = new Object();
    tags = new Object();
    url = __dirname.slice(0, -17) + "/public" + url;
    return readFile(url, function(html) {
      return jsdom.env(html, ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
        getClassesIdsTags(window.$("body")[0]);
        return callback(classes, ids, tags);
      });
    });
  };
  exports.assignIDFObjects = function(url, sectionId, packageId, callback) {
    mySql.clearObjects(function() {});
    return mySql.getAssociationsForPackage(packageId, function(associations) {
      var association, associationObj, _i, _len, _ref;
      associationObj = {
        "class": new Object(),
        "id": new Object(),
        "tag": new Object(),
        "sectionId": sectionId,
        "packageId": packageId
      };
      for (_i = 0, _len = associations.length; _i < _len; _i++) {
        association = associations[_i];
        if (!(((_ref = associationObj[association.type][association.name]) != null ? _ref.length : void 0) != null)) {
          associationObj[association.type][association.name] = new Array();
        }
        associationObj[association.type][association.name].push(association.componentId);
      }
      url = __dirname.slice(0, -17) + "/public" + url;
      return readFile(url, function(html) {
        return jsdom.env(html, ['http://code.jquery.com/jquery-1.5.min.js'], function(errors, window) {
          return insertIDFObjects(window.$("body")[0], 0, associationObj);
        });
      });
    });
  };
}).call(this);
