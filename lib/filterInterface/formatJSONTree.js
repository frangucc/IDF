(function() {
  var MySql, addChild, addFilters, addNode, addNodes, addPackages, filterDb, filters, getPackageNames, mySql, removeBlankPackages, tree;
  MySql = require('../utilities/mySqlDatabase');
  mySql = new MySql();
  filterDb = require('./filterDatabase');
  tree = new Object();
  filters = new Array();
  /*
  nodes have this format
  node = {
      data: string #the actual name of the section/package, is displayed in the tree
      children: array of nodes #an array of children nodes and of filter nodes
      attr: {
          id: int         #the section id, for packages id = 0
          package: int    #the package id
          parentId: int   #the section id of the parent node
          class: string   #a css class, class = "parent" if it is a parent section, "section" if it is a base section with no sub-sections, or "filter" if it is a filter
          href: string    #the url of the page that should be accessed upon the selection of this node in the tree
      }
  }
  */
  addPackages = function(number, callback) {
    var i, _ref;
    i = 0;
    while (i < number) {
      if (!(((_ref = tree.children) != null ? _ref[0] : void 0) != null)) {
        tree.children = new Array();
      }
      tree.children.push({
        data: "" + i,
        attr: {
          id: 0,
          "class": "package",
          package: i
        },
        children: new Array()
      });
      i++;
    }
    return getPackageNames(function() {
      var package, _i, _len, _ref2;
      _ref2 = tree.children;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        package = _ref2[_i];
        addFilters(package);
      }
      return callback();
    });
  };
  addNodes = function(results, callback) {
    var node, result, _i, _len;
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      result = results[_i];
      node = {
        data: result.name,
        attr: {
          id: result.id,
          package: result.content_package_id,
          parentId: result.parent_section_id,
          "class": "section"
        },
        children: new Array()
      };
      node.attr.href = "/getContent/" + node.attr.id + "/" + node.data;
      node = addFilters(node);
      addNode(node);
    }
    return callback();
  };
  addFilters = function(node) {
    var filter, _i, _len, _ref, _ref2;
    node.children.push({
      data: "new_filter",
      attr: {
        "class": "new filter",
        href: "/addfilter/" + node.attr.package + "/" + node.attr.id + "/" + node.data
      }
    });
    if (((_ref = filters[node.attr.id]) != null ? _ref.length : void 0) != null) {
      _ref2 = filters[node.attr.id];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        filter = _ref2[_i];
        if (("" + filter.package) === ("" + node.attr.package)) {
          node.children.push({
            data: filter.filter,
            attr: {
              "class": "filter",
              href: "/editfilter/" + node.attr.package + "/" + node.attr.id + "/" + node.data + "/" + filter.filter
            }
          });
        }
      }
    }
    return node;
  };
  addNode = function(newNode) {
    var myPackage;
    myPackage = tree.children[newNode.attr.package];
    return addChild(newNode, myPackage);
  };
  addChild = function(newNode, currentNode) {
    var currentIndex, goodIndex;
    if (currentNode.attr.id === newNode.attr.parentId) {
      currentNode.attr["class"] = " parent";
      return currentNode.children.push(newNode);
    } else {
      if (currentNode.children.length > 0) {
        currentIndex = 0;
        goodIndex = 0;
        while (currentIndex < currentNode.children.length) {
          if (currentNode.children[currentIndex].attr["class"].indexOf("filter") < 0) {
            if (currentNode.children[currentIndex].attr.id <= newNode.attr.parentId) {
              goodIndex = currentIndex;
            }
          }
          currentIndex++;
        }
        return addChild(newNode, currentNode.children[goodIndex]);
      } else {
        return console.log("help - infinite loop");
      }
    }
  };
  removeBlankPackages = function(callback) {
    var i;
    i = tree.children.length - 1;
    while (i >= 0) {
      if (tree.children[i].children.length === 1) {
        tree.children.splice(i, 1);
      }
      i--;
    }
    return callback();
  };
  getPackageNames = function(callback) {
    var titleHash;
    titleHash = new Object();
    return mySql.getPackages(function(results) {
      var package, result, _i, _j, _len, _len2, _ref;
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        titleHash[result.id] = result.title;
      }
      _ref = tree.children;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        package = _ref[_j];
        if (titleHash[package.attr.package] != null) {
          package.data = titleHash[package.attr.package];
        }
      }
      return callback();
    });
  };
  module.exports = {
    getJSON: function(forView, callback) {
      tree = {
        data: "Head",
        attr: {
          id: -1,
          package: -1
        },
        state: "open"
      };
      return filterDb.getDBbyID(function(filterHash) {
        filters = filterHash;
        return mySql.getAll(function(results) {
          results = results;
          return addPackages(60, function() {
            return addNodes(results, function() {
              if (forView === true) {
                return removeBlankPackages(function() {
                  console.log("Obtained Tree -v");
                  return callback(tree);
                });
              } else {
                console.log("Obtained Tree");
                return callback(tree);
              }
            });
          });
        });
      });
    }
  };
}).call(this);
