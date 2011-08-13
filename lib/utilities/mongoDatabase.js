(function() {
  var Content, ContentSchema, Schema, checkForDuplicate, mongoose;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  ContentSchema = new Schema({
    title: String,
    content: String,
    author: String,
    source: String,
    url: String,
    workerID: String,
    query: String
  });
  mongoose.connect('mongodb://localhost/augmentedContent');
  mongoose.model('Content', ContentSchema);
  Content = mongoose.model('Content');
  exports.clear = function() {
    return Content.remove({}, function() {});
  };
  exports.insertIntoDB = function(data) {
    return checkForDuplicate(data, function(duplicate, data) {
      var content;
      if (!duplicate) {
        console.log("entered into db -" + data.workerID);
        content = new Content();
        content.title = data.title;
        content.content = data.content;
        content.author = data.author;
        content.source = data.source;
        content.url = data.url;
        content.workerID = data.workerID;
        content.query = data.queryText;
        return content.save(function(err) {
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
    return Content.find({}, function(err, docs) {
      var doc, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        doc = docs[_i];
        console.log(doc.title + " : " + doc.source + " - " + doc.url + " * " + doc.query);
        _results.push(console.log(""));
      }
      return _results;
    });
  };
  checkForDuplicate = function(data, callback) {
    return Content.find({
      query: data.queryText
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
          if (doc.url === data.url) {
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
  exports.getContent = function(heading, res, callback) {
    return Content.find({
      query: heading
    }, function(err, docs) {
      if (docs.length > 0) {
        return callback(res, docs);
      } else {
        return callback(res, "no content");
      }
    });
  };
}).call(this);
