/**
 *  @author Daniel Brooks
 *  @desc demo style structures and script
 */

$(function () {

/**
 * the point here is to keep the same structure
 * as the json object that you will be expecting.
 */

    var test1 = {
            style :
                {
                    "div" : "name",
                    	key : "test.more.levels", // push down into furthest array
                    	levels : {
                    	span : [ "id", "title"]
                    }
                },
            filename: 'res/data/datamine1.json'
        },
        test2 = {
            style :
                {
					key : "items",
					items : {
						"div": ["title", "desc"]
					}
                },
            filename: 'res/data/arraydata.simple.json'
        },

        // demo page example
        test3 = {
    		style :
    		{
    			key : "items",
    			items : {
    				"div" : ["title", "isbn10", "lang"],
    				"a" : "link"
    			}
    		},
	    	filename : 
			[ 
	            {
	        	   "title" : "The Creature From Jekyll Island",
	               "isbn10" : 0912986212,
	               "lang" : "English",
	               "link" : "http:\/\/link\/to\/book\/" 
	            },
	            {
	               "title" : "Brave New World",
	               "isbn10" : 0060850523,
	               "lang" : "English",
	               "link" : "http:\/\/link\/to\/book\/"
	            }, 
	            {
	               "title" : "Confessions of an Economic Hitman", 
	               "isbn10" : 0452287081, 
	               "lang" : "English", 
	               "link" : "http:\/\/link\/to\/book\/"
	            }
            ]
    	},

    /*
     * Test 4
     * test 4 style mockup and associated data file
     */
    	test4 = {
            style :
                {   // $(selector)
                    span : ["author"]   // <span class="author">...
    				, a : [ "homepage" ]
    				, div : "date myClass" // add two classes to the element <div class="date myClass">[date format]</div>
                    , data : { // <div class="data">...
                        "span" : "title",   // <span class="title">...
                        "div" : {   // <div>...
                            key : "data.items", // map reference to the data

                            // <ul class="items">...
                            //   items is an array of objects in the json data object
                            //       each array object is wrapped in <li> element
                            // has to be named the last object map key object["data"]["items"]
                            items : {    // has to be named the last object map key (data["items"]
                               "span" : "title"   // <span class="title">...
                            }
                        }
                    }
                },
            filename : 'res/data/interests.json'
        },

        test5 = {
    		style :
    			{
    				span : ["date month day year", "storeinfo"],
    				div : {
    					key : "data.authors",
    					authors : {
    						div : "title",
    						span : [ "isbn10", "lang" ]
    					}
    				}
    			},
    			filename :
    				{
    					"storeinfo" : "A Random Bookstore",
    					"date" : "/Date(1320540472000)/",
    					"data" : {
    						"authors" : [
								{
									"title" : "The Creature From Jekyll Island",
									"isbn10" : 0912986212,
									"lang" : "English"
								},
								{
									"title" : "Brave New World",
									"isbn10" : 0060850523,
									"lang" : "English"
								},
								{
									"title" : "Confessions of an Economic Hitman",
									"isbn10" : 0452287081,
									"lang" : "English"
								}
							]
    					}
    				}
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
    $('#reset1').live('click', function(){
    	$('.root').children().remove();
    });

    $('#demo2').live('click', function(){
    	var $r = $('.root2');
    	removeChildren.call($r);
    	$r.styleJSON( test2.filename, test2.style );
    });
    $('#reset2').live('click', function(){
    	$('.root2').children().remove();
    });

    $('#demo3').live('click', function(){
    	var $r = $('.root3');
    	removeChildren.call($r);
    	$r.styleJSON( test3.filename, test3.style );
    });
    $('#reset3').live('click', function(){
    	$('.root3').children().remove();
    });

    $('#demo4').live('click',function(){
    	var $r = $('.root4');
    	removeChildren.call($r);
    	$r.styleJSON( test4.filename, test4.style );
    });
    $('#reset4').live('click', function(){
    	$('.root4').children().remove();
    });

    $('#demo5').live('click', function(){
    	var $r = $('.root5');
    	removeChildren.call($r);
    	$r.styleJSON( test5.filename, test5.style, {
    		masks : {
    			date : {
    				'date' : function(date, el, df){
    					date = Date.fromDotNetJSONDate(date);
    		    		var out = [], p;
    		    		for( p in dateFormat.masks ) $(el).append( $( document.createElement('em') ).html( p + ': ' + dateFormat( date, dateFormat.masks[ p ] ) ) );
    				}
    			}
    		}
    	} );
    });
    $('#reset5').live('click', function(){
    	$('.root5').children().remove();
    });
    

//    $.styleJSON( test3.filename, test3.style, function() { alert('complete'); } );
});