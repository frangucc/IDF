//to add a worker to the application, all you need to edit is workForce.coffee and this object below
allWorkers = {
    hp: "Hyper Physics",
    owl: "Purdue Online Writing Lab",
    wmw: "Wolfram Math World",
    youtube: "Youtube",
    wikipedia: "Wikipedia",
    quizlet: "Quizlet"
};


/**
 * Module dependencies.
 */

var express = require('express');


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

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Index',
        type: 'none'
    });
});


//IDF

var uiHelper = require('./lib/idfInterface/uiHelper');
var manager = require('./lib/manager');
var idfTree = require ("./lib/idfTree");

app.get('/idf', function(req, res) {
    var page = "triangles.html"
    var url = "/15/"+page;
    uiHelper.getProperties(res, url, function(classes, ids, tags) {
        manager.getComponents(function(components) {
            res.render('IDFAssociations/addAssociations', {
                title: 'doc',
                url: url,
                classes: classes,
                ids: ids,
                tags: tags,
                components: components,
                type: "docLoading jstree"
            });
        });
    });
});


app.get('/associate/form', function(req, res){
    res.redirect('/idf');
});

app.post('/associate/form/submit', function(req, res) {
    manager.handleAssociationForm(req.body, function() {
        res.redirect('/associate/form/');
    });
});

app.get('/components/form', function(req, res){
    manager.getComponents(function(components) {
        res.render('IDFComponents/componentBuild', {
            title: 'Edit IDF Components',
            components: components,
            type: "none"
        });
    });
});

app.post('/components/form/submit', function(req, res) {
    manager.handleComponentsForm(req.body, function() {
        res.redirect('/components/form');
    });
});

app.get('/associate/remove', function(req, res) {
    manager.getAssociationsAndComponents(15, function(associations) {
        res.render('IDFAssociations/removeAssociations', {
            title: 'Remove Associations',
            associations: associations,
            type: "none"
        });
    });
});

app.post('/associate/remove/submit', function(req, res) {
    manager.handleAssociationRemovalForm(req.body, function() {
        res.redirect('/associate/form/');
    });
});

app.get('/createObjects', function(req, res) {
    var page = "triangles.html"
    var url = "/15/"+page;
    uiHelper.assignIDFObjects(url, 8888, 15);
    res.render('IDFAssociations/creationSubmit', {
        title: 'Associated Objects',
        type: "none"
    });
});

app.get('/viewObjects', function(req, res) {
    idfTree.createTree (8888, function (tree) {
        res.send (tree);
    });
});

//Content Augmentation

//this is the main express app with all of the routes


var MySQL = require("./lib/utilities/mySqlDatabase");
var database = require("./lib/utilities/mongoDatabase");
var contentTree = require("./lib/filterInterface/formatJSONTree");
var manageFilters = require("./lib/filterInterface/manageFilters");
var filterDb = require("./lib/filterInterface/filterDatabase");

mySQLInput = new MySQL();

//this displays the accordion for viewing the content results
app.get('/getContent/:id/:name', function(req, res){
    manager.liveQuery(req.params.name, req.params.id, res, function(content) {
        res.render('contentAccordion', {
            title: 'content accordion',
            type: "accordion",
            content: content
        });
    });
}); 

//this displays the tree in native json
app.get('/treejson', function(req, res){
  contentTree.getJSON(true, function(results) {
      res.send(results);
  });
});

//this displays the tree with jstree
app.get('/contentAug', function (req, res) {
    res.render('contentTree', {
        title: 'Content Tree',
        type: "jstree"
    });
});

//this is the add filter page
app.get('/addfilter/:packageId/:id/:name', function (req, res) {
    res.render('Filters/addFilter', {
        title: "Add a Filter to #{req.params.name}",
        type: "none",
        name: req.params.name,
        package: req.params.packageId,
        id: req.params.id
    });
});

//this is the submit route for adding a filter
app.post('/addFilter/submit', function (req, res) {
    manageFilters.add(req.body);
    res.render('Filters/submitLanding', {
        message: "Added Filter",
        title: "Successful Addition",
        type: "none"
    });
});

//this is the edit filter page
app.get('/editfilter/:packageId/:id/:name/:filter', function (req, res) {
    filterDb.getFilters(req.params.id, req.params.filter, function (filter) {
        res.render('Filters/editFilter', {
            title: "Edit Filter for #{req.params.name}",
            type: "none",
            name: req.params.name,
            filter: filter
        });
    });
});

//this is the submit route for editing a filter
app.post('/editFilter/submit', function (req, res) {
    manageFilters.edit(req.body);
    res.render('Filters/submitLanding', {
        message: "Edited Filter",
        title: "Successful Edit",
        type: "none"
    });
});

app.get('/customQuery', function (req, res) {
    res.render('customQuery', {
        title: "Make a Custom Query",
        type: "none"
    });
});

app.post('/customQuery/submit', function(req, res) {
    res.redirect("/getContent/1/"+req.body.query+"");
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
