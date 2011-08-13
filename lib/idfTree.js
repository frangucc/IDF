(function() {
  var MySql, addChild, addNodes, mySql, tree;
  MySql = require("./database");
  mySql = new MySql();
  tree = new Object();
  addNodes = function(results, callback) {
    var node, result, _i, _len;
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      result = results[_i];
      node = {
        data: "" + result.component,
        attr: {
          id: result.id,
          packageId: result.packageId,
          parentId: result.parentId,
          sectionId: result.sectionId,
          tag: result.tag,
          "class": "component"
        },
        children: new Array()
      };
      node.children.push({
        data: "html",
        attr: {
          "class": "content-node"
        },
        children: [
          {
            data: result.content,
            attr: {
              "class": "content"
            }
          }
        ]
      });
      node.attr.href = "/getContent/" + node.attr.id + "/" + node.data;
      addChild(node, tree);
    }
    return callback();
  };
  addChild = function(newNode, currentNode) {
    var currentIndex, goodIndex;
    if (currentNode.attr.id === newNode.attr.parentId) {
      return currentNode.children.push(newNode);
    } else {
      if (currentNode.children.length > 0) {
        currentIndex = 0;
        goodIndex = 0;
        while (currentIndex < currentNode.children.length) {
          if (currentNode.children[currentIndex].attr.id <= newNode.attr.parentId) {
            goodIndex = currentIndex;
          }
          currentIndex++;
        }
        return addChild(newNode, currentNode.children[goodIndex]);
      } else {
        return console.log("help - infinite loop");
      }
    }
  };
  exports.createTree = function(sectionId, callback) {
    tree = {
      data: "Section",
      attr: {
        id: 0,
        "class": "Head"
      },
      state: "open",
      children: new Array()
    };
    return mySql.getObjectsForSectionWithComponent(sectionId, function(results) {
      return addNodes(results, function() {
        return callback(tree);
      });
    });
  };
}).call(this);
