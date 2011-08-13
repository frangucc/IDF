(function() {
  var adder, editer, filterDb, findNode, getChildren, propagation, tree;
  tree = require("./formatJSONTree");
  filterDb = require("./filterDatabase");
  findNode = function(id, currNode) {
    var currentIndex, goodIndex;
    if (currNode.attr["class"].indexOf("filter") < 0) {
      if (("" + id) === ("" + currNode.attr.id)) {
        return currNode;
      } else {
        currentIndex = 0;
        goodIndex = 0;
        while (currentIndex < currNode.children.length) {
          if (currNode.children[currentIndex].attr["class"].indexOf("filter") < 0) {
            if (currNode.children[currentIndex].attr.id <= id) {
              goodIndex = currentIndex;
            }
          }
          currentIndex++;
        }
        return findNode(id, currNode.children[goodIndex]);
      }
    }
  };
  getChildren = function(node) {
    var array, array2, child, element, _i, _j, _len, _len2, _ref;
    array = new Array();
    if (node.attr["class"].indexOf("filter") < 0) {
      array.push(node.attr.id);
      _ref = node.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        array2 = getChildren(child);
        if (array2.length > 0) {
          for (_j = 0, _len2 = array2.length; _j < _len2; _j++) {
            element = array2[_j];
            array.push(element);
          }
        }
      }
    }
    return array;
  };
  adder = function(filter, propagate) {
    if (filter.filter.slice(0, 4) === "alt:") {
      propagate = "no";
    }
    if (propagate === "no") {
      filterDb.insertIntoDB(filter);
    }
    if (propagate === "yes") {
      return propagation(filter, "add");
    }
  };
  editer = function(filter, propagate, removal) {
    if (filter.original.slice(0, 4) === "alt:") {
      propagate = "no";
    }
    if (propagate === "no") {
      filterDb.deleteFromDB(filter.id, filter.package, filter.original);
      if (removal === "no") {
        filterDb.insertIntoDB(filter);
      }
    }
    if (propagate === "yes") {
      if (removal === "yes") {
        propagation(filter, "remove");
      }
      if (removal === "no") {
        return propagation(filter, "remove_add");
      }
    }
  };
  propagation = function(filter, action) {
    return tree.getJSON(false, function(tree) {
      var childId, childrenIdArray, filterTemp, node, _i, _len, _results;
      node = findNode(filter.id, tree.children[filter.package]);
      childrenIdArray = getChildren(node);
      _results = [];
      for (_i = 0, _len = childrenIdArray.length; _i < _len; _i++) {
        childId = childrenIdArray[_i];
        if (action === "remove_add" || action === "remove") {
          filterDb.deleteFromDB(childId, filter.package, filter.original);
        }
        _results.push(action === "remove_add" || action === "add" ? (filterTemp = new Object(), filterTemp.id = childId, filterTemp.filter = filter.filter, filterTemp.subjects = filter.subjects, filterTemp.package = filter.package, filterDb.insertIntoDB(filterTemp)) : void 0);
      }
      return _results;
    });
  };
  /*
  formData = {
      id: "#"
      package: "#"
      text: "..."
      subjects: [
          "wikipedia",
          etc...
      ],
      propagate: "yes" or "no"
  }
  */
  exports.add = function(formData, allWorkers) {
    var filter, name, subject, worker, _i, _len, _ref;
    filter = {
      id: formData.id,
      package: formData.package,
      filter: formData.text,
      subjects: {}
    };
    for (worker in allWorkers) {
      name = allWorkers[worker];
      filter.subjects[worker] = false;
    }
    _ref = formData.subjects;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subject = _ref[_i];
      filter.subjects[subject] = true;
    }
    return adder(filter, formData.propagate);
  };
  /*
  formData = {
      id: "#"
      package: "#"
      removal: "yes" or "no"
      text: "..."
      subjects: [
          "wikipedia",
          etc...
      ],
      propagate: "yes" or "no"
  }
  */
  exports.edit = function(formData, allWorkers) {
    var filter, name, subject, worker, _i, _len, _ref;
    filter = {
      id: formData.id,
      package: formData.package,
      filter: formData.text,
      subjects: {},
      original: formData.original
    };
    for (worker in allWorkers) {
      name = allWorkers[worker];
      filter.subjects[worker] = false;
    }
    _ref = formData.subjects;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subject = _ref[_i];
      filter.subjects[subject] = true;
    }
    return editer(filter, formData.propagate, formData.removal);
  };
}).call(this);
