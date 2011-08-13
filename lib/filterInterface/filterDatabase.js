(function() {
  var Filter, FilterSchema, Schema, checkForDuplicate, eyes, mongoose, name, schemaObject, worker;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  eyes = require('eyes');
  schemaObject = {
    id: Number,
    package: Number,
    filter: String
  };
  for (worker in allWorkers) {
    name = allWorkers[worker];
    schemaObject[worker] = Boolean;
  }
  FilterSchema = new Schema(schemaObject);
  mongoose.connect('mongodb://localhost/augmentedContent');
  mongoose.model('Filter', FilterSchema);
  Filter = mongoose.model('Filter');
  exports.clear = function() {
    return Filter.remove({}, function() {});
  };
  /*
  data should be of the format
  data = {
      id: int
      filter: string
      subjects: {
          owl: Boolean
          wmw: Boolean
          hp: Boolean
          youtube: Boolean
          wikipedia: Boolean
      }
  }
  */
  exports.insertIntoDB = function(data) {
    return checkForDuplicate(data, function(duplicate, data) {
      var filter, use, worker, _ref;
      if (!duplicate) {
        console.log("entered into db -" + data.id);
        filter = new Filter();
        filter.id = data.id;
        filter.package = data.package;
        filter.filter = data.filter;
        _ref = data.subjects;
        for (worker in _ref) {
          use = _ref[worker];
          filter[worker] = use;
        }
        return filter.save(function(err) {
          if (err) {
            throw err;
          }
        });
      } else {
        return console.log("duplicate");
      }
    });
  };
  exports.printDB = function() {
    return Filter.find({}, function(err, docs) {
      var doc, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        doc = docs[_i];
        _results.push(eyes.inspect(doc));
      }
      return _results;
    });
  };
  exports.getDBbyID = function(callback) {
    return Filter.find({}, function(err, docs) {
      var currId, doc, filters, _i, _len, _ref;
      filters = new Object();
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        doc = docs[_i];
        currId = doc.id;
        if (!((((_ref = filters[currId]) != null ? _ref.length : void 0) != null) > 0)) {
          filters[currId] = new Array();
        }
        filters[currId].push(doc);
      }
      return callback(filters);
    });
  };
  checkForDuplicate = function(data, callback) {
    return Filter.find({
      id: data.id
    }, function(err, docs) {
      var called, doc, _i, _len;
      called = false;
      if (docs.length < 0) {
        called = true;
        callback(false, data);
      }
      if (!called) {
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          doc = docs[_i];
          if (doc.filter === data.filter && doc.package === data.package) {
            called = true;
            callback(true, data);
          }
        }
        if (!called) {
          return callback(false, data);
        }
      }
    });
  };
  exports.getFilters = function(id, filter, callback) {
    return Filter.find({
      id: id
    }, function(err, docs) {
      var doc, _i, _len, _results;
      if (docs.length > 0) {
        _results = [];
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          doc = docs[_i];
          _results.push(doc.filter === filter ? callback(doc) : void 0);
        }
        return _results;
      } else {
        return callback("no content");
      }
    });
  };
  exports.deleteFromDB = function(id, package, filter) {
    return Filter.remove({
      id: id,
      filter: filter,
      package: package
    }, function() {});
  };
}).call(this);
