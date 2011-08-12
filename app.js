
/**
 * Module dependencies.
 */

var express = require('express');
var uiHelper = require('./lib/uiHelper');
var manager = require('./lib/manager');
var tree = require ("./lib/idfTree");

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/components/form', function(req, res){
    manager.getComponents(function(components) {
        res.render('componentBuild', {
            title: 'Edit IDF Components',
            components: components
        });
    });
});

app.post('/components/form/submit', function(req, res) {
    manager.handleComponentsForm(req.body, function() {
        res.redirect('/components/form');
    });
});

app.get('/associate', function(req, res){
  res.render('comparison', {
    title: 'Associate an HTML Structure with an IDF Component'
  });
});

app.get('/associate/remove', function(req, res) {
    manager.getAssociationsAndComponents(15, function(associations) {
        res.render('removeAssociations', {
            title: 'Remove Associations',
            associations: associations
        });
    });
});

app.post('/associate/remove/submit', function(req, res) {
    manager.handleAssociationRemovalForm(req.body, function() {
        res.redirect('/associate/form/');
    });
});

app.get('/associate/form', function(req, res){
    res.redirect('/');
});

app.get('/', function(req, res) {
    var page = "triangles.html"
    var url = "/15/"+page;
    uiHelper.getProperties(res, url, function(classes, ids, tags) {
        manager.getComponents(function(components) {
            res.render('addAssociations', {
                title: 'doc',
                url: url,
                classes: classes,
                ids: ids,
                tags: tags,
                components: components
            });
        });
    });
});

app.post('/associate/form/submit', function(req, res) {
    manager.handleAssociationForm(req.body, function() {
        res.redirect('/associate/form/');
    });
});

app.get('/createObjects', function(req, res) {
    var page = "triangles.html"
    var url = "/15/"+page;
    uiHelper.assignIDFObjects(url, 8888, 15);
    res.send ("done");
});
app.get('/viewObjects', function(req, res) {
    tree.createTree (8888, function (tree) {
        res.send (tree);
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
