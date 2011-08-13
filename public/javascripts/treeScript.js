//This jquery function renders the javascript-based tree for the ui
$(function () {
    //the current id it binds to is "demo2"
	$("#demo2").jstree({ 
		"json_data" : {
			//it gets the data for the tree by making an ajax request to /treejson which has the tree in json format
			"ajax" : {
				"url" : "/treejson",
				//I'm not sure what this does, but it was in the plugin documentation
				"data" : function (n) { 
					return { id : n.attr ? n.attr("id") : 0 }; 
				}
			},
			//this is turned to true to make it so that the whole tree does not need to be rendered at one time
			//which would be very slow
            "progressive_render" : true
		},
		"plugins" : [ "themes", "json_data", "ui" ]
	}).bind("select_node.jstree", function (e, data) {
	    //this creates the action so that when a filter is clicked on it opens the filter edit/add page based on the href of the filter
	    if(data.rslt.obj.attr("class").indexOf("filter") >= 0){
	        window.location=data.rslt.obj.attr("href");
        }
        //this creates the action so that when a section is clicked (one that is not a parent because parents aren't true sections) the augmented content page is rendered in a new tab/window
        else if(data.rslt.obj.attr("class").indexOf("parent") < 0){
            window.open(data.rslt.obj.attr("href"));
        }
    });
    
    $("#tree").jstree({ 
		"json_data" : {
			//it gets the data for the tree by making an ajax request to /treejson which has the tree in json format
			"ajax" : {
				"url" : "/viewObjects",
				//I'm not sure what this does, but it was in the plugin documentation
				"data" : function (n) { 
					return { id : n.attr ? n.attr("id") : 0 }; 
				}
			},
			//this is turned to true to make it so that the whole tree does not need to be rendered at one time
			//which would be very slow
            "progressive_render" : true
		},
		"plugins" : [ "themes", "json_data", "ui" ]
	}).bind("select_node.jstree", function (e, data) {
	    /*//this creates the action so that when a filter is clicked on it opens the filter edit/add page based on the href of the filter
	    if(data.rslt.obj.attr("class").indexOf("filter") >= 0){
	        window.location=data.rslt.obj.attr("href");
        }
        //this creates the action so that when a section is clicked (one that is not a parent because parents aren't true sections) the augmented content page is rendered in a new tab/window
        else if(data.rslt.obj.attr("class").indexOf("parent") < 0){
            window.open(data.rslt.obj.attr("href"));
        }*/
    });
});

