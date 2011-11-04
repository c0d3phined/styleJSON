/**
 *  @author Daniel Brooks
 *  @desc demo style structures and script
 */

$(function(){

/**
 * the point here is to keep the same structure
 * as the json object that you will be expecting.
 */

    var test1 = {
            style:
                {
                    "div":"name"
                    // push down into furthest array
                    ,key : "test.more.levels"
                    ,levels: {
                    	span : ["id","title"]
                    }
                },
            filename: 'data/datamine1.json'
        },
        test2 = {
            style:
                {
					key : "items",
					items : {
						"div":["title","desc"]
					}
                },
            filename: 'data/arraydata.simple.json'
        },

        // demo page example
        test3 = {
	    	style:
		    	{
					key : "items",
	    			items: {
    					"div" : ["title","isbn10","lang"]
	    			}
		    	},
	    	filename: 
	    			[
	    	           {
	    	               "title": "The Creature From Jekyll Island",
	    	               "isbn10" : 0912986212,
	    	               "lang": "English"
	    	           },
	    	           {
	    	               "title": "Brave New World",
	    	               "isbn10" : 0060850523,
	    	               "lang": "English"
	    	           },
	    	           {
	    	               "title": "Confessions of an Economic Hitman",
	    	               "isbn10" : 0452287081,
	    	               "lang": "English"
	    	           }
    	           ]
    	},

    /*
     * Test 4
     * test 4 style mockup and associated data file
     */
    	test4 = {
            style:
                {   // $(selector)
                    "span": ["author"]   // <span class="author">...
    				,div : "date myClass"	// add two classes to the element <div class="date myClass">[date format]</div>
                    ,data: { // <div class="data">...
                        "span" : "title",   // <span class="title">...
                        "div" : {   // <div>...
                            key : "data.items", // map reference to the data

                            // <ul class="items">...
                            //   items is an array of objects in the json data object
                            //       each array object is wrapped in <li> element
                            // has to be named the last object map key object["data"]["items"]
                            items: {    // has to be named the last object map key (data["items"]
                               "span" : "title"   // <span class="title">...
                            }
                        }
                    }
                },
            filename: 'data/interests.json'
        };

    /* not recommended */

    function removeChildren(){
    	$(this).children().remove();
    }

    $('#demo1').live('click',function(){
    	var $r = $('.root');
    	removeChildren.call($r);
    	$r.styleJSON( test1.filename, test1.style );    // simple array structure
    });
    $('#demo2').live('click', function(){
    	var $r = $('.root2');
    	removeChildren.call($r);
    	$r.styleJSON( test2.filename, test2.style );
    });
    $('#demo3').live('click', function(){
    	var $r = $('.root3');
    	removeChildren.call($r);
    	$r.styleJSON( test3.filename, test3.style );
    });
    $('#demo4').live('click',function(){
//    	$.styleJSON.defaults.dateFormat = "dddd, mmmm d, yyyy";
    	var $r = $('.root4');
    	removeChildren.call($r);
    	$r.styleJSON( test4.filename, test4.style );
    });
});