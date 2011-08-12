

function selectNone() {
    $('.availClasses option[value="none"]').attr('selected', 'selected');
    $('.availIds option[value="none"]').attr('selected', 'selected');
    $('.availTags option[value="none"]').attr('selected', 'selected');
}

$(document).ready(function() {
    var formatting = " {border: 2px solid black; background-color:#58D3F7;}";

    $('.classIDF').click(function(event) {
        event.preventDefault();
        /*
        var me = $( event.currentTarget ),
            my = me,
            className = my.html(),
            objects = $("." + className );
                
        objects.css({"border":"2px solid black","background-color":"#58d3f7"})
        */
        var style = document.createElement
        $('#selected').html("#doc ."+this.innerHTML+formatting);
        
        selectNone();
        $('.availClasses option[value="'+this.innerHTML+'"]').attr('selected', 'selected');
    });

    $('.idIDF').click(function(event) {
        event.preventDefault();
        
        var style = document.createElement
        $('#selected').html("#doc #"+this.innerHTML+formatting);
        
        selectNone();
        $('.availIds option[value="'+this.innerHTML+'"]').attr('selected', 'selected');
    });

    $('.tagIDF').click(function(event) {
        event.preventDefault();
        
        var style = document.createElement
        $('#selected').html("#doc "+this.innerHTML+formatting);
        
        selectNone();
        $('.availTags option[value="'+this.innerHTML+'"]').attr('selected', 'selected');
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
	}).bind("select_node.jstree", function (e, data) {})

});
