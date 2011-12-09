/**
 *  @author Daniel Brooks
 *  @desc demo style structures and script
 */

(function(){

/**
 * the point here is to keep the same structure
 * as the json object that you will be expecting.
 */

    var test1 = {
            style:
            {
				key : "items",
				items : {
					"div":["title","desc"]
				}
            },
            filename: '../data/arraydata.simple.json'
    	},


    	test2 = {
            style:
	            {
	                "div":"name"
	                // push down into furthest array
	                ,key : "test.more.levels"
	                ,levels: {
	                	span : ["id","title"]
	                }
	            },
            filename: '../data/datamine1.json'
        },


        // demo page example
        test3 = {
	    	style:
	    	{
				span : ["date month day year", "storeinfo"],
				div : {
					key : "data.authors",
					authors : {
    					"div" : ["title","isbn10","lang"],
    					"a" : "link"
	    			}
				}
	    	},
	    	filename: 
			{
				"storeinfo" : "A Random Bookstore",
				"date" : "/Date(1320540472000)/",
				"data" : {
					"authors" : [
	    	           {
	    	               "title": "The Creature From Jekyll Island",
	    	               "isbn10" : 0912986212,
	    	               "lang": "English",
	    	               "link" : "http:\/\/link\/to\/book\/"
	    	           },
	    	           {
	    	               "title": "Brave New World",
	    	               "isbn10" : 0060850523,
	    	               "lang": "English",
	    	               "link" : "http:\/\/link\/to\/book\/"
	    	           },
	    	           {
	    	               "title": "Confessions of an Economic Hitman",
	    	               "isbn10" : 0452287081,
	    	               "lang": "English",
	    	               "link" : "http:\/\/link\/to\/book\/"
	    	           }
    	           ]
				}
			}
    	},


    /*
     * Test 4
     * test 4 style mockup and associated data file
     */
    	test4 = {
            style:
                {   // $(selector)
                    span: "author"   // <span class="author">...
    				,a : [ "homepage" ]
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
            filename: '../data/interests.json'
        },


        test5 = {
    		style :
    			{
    				span : ["completed_in", "storeinfo"], // storeinfo node doesn't exist in data-source
    				key: 'results',
    				results : {
    					span : "created_at",
						em : [ "from_user", "to_user_name" ],
						h3 : ["text"]

//						,key : 'metadata',
//						metadata : {
//							type : "result_type"
//						}
    				}
    			},
			filename : '../data/twitter.sample1.json'
    	},


    	test6 = {
        style :
            {   // $(selector)
                "span": ["author"] // <span class="author">...
                ,data: { // <div class="data">...
                    "span" : "title", // <span class="title">...
                    "div" : { // <div>...
                        key : "data.items" // map reference to the data

                        // <ul class="items">...
                        //   items is an array of objects in the json data object
                        //       each array object is wrapped in <li> element
                        // has to be named the last object map key object["data"]["items"]
                        ,items: {
                           "span" : "title" // <span class="title">...
                           ,"div" : { // <div>...
                               key : "experience" // object["data"]["items"]["experience"]

                               // <ul class="experience">...
                               //   experience is an array of objects in the json data object
                               //       each object is wrapped in <li> element
                               ,experience : {

                                   // <span class="title"></span> <span class="time"></span>
                                   //   will search object["data"]["items"][i]["experience"] for properties named 'title' or 'time'
                                   "div" : ["title","time"],
                                   key : "projects", // key = object["data"]["items"][i]["experience"][x]["projects"]
                                   projects : { // <ul class="projects">...
                                       // <span class="company">key['company']</span>...<span class="name">key['name']</span>...etc
                                       "div" : ["company", "name", "desc", "ref"]
                                   } // </ul>...
                               } // </ul>...
                           } // </div>...
                        } // </ul>...
                    } // </div>...
                } // </div>...
            },
        filename : '../data/skills.full.json'
    };

	 // http://jdev.blogsome.com/2006/08/18/compact-script-to-calculate-script-execution-time/
	 var stopwatch =  {
	     start:function (){
	         d = new Date();
	         time = d.getTime();
	     },

	     getTime:function (){
	         d = new Date();
	         return (d.getTime()-time);
	     }
	 };

    function get( id ) {
    	return document.getElementById( id );
    }

    function addEvent( el, event, fn ) {
	    if (el.addEventListener){
		  el.addEventListener(event, fn, false); 
		} else if (el.attachEvent){
		  el.attachEvent('on'+event, fn );
		}
    }

    function showtime( ele ) {
    	var w = '-watch', li = ele.ele.parentNode, 
    		div = styleJSON.Context( document.getElementById( ele.attr( 'id' ) + w ) || document.createElement( 'div' ) ), 
    		txt = 'execution time:'+ stopwatch.getTime() + 'ms';
    	div.addClass( 'stopwatch' ).attr( 'id', ele.attr( 'id' ) + w ).text( txt );

    	li.insertBefore( div.ele, ele.ele );
    }

    var d1 = get('btndemo1');
    addEvent( d1, 'click', function(){
    	styleJSON.init('demo1', test2.filename, test2.style );
    });

    var d2 = get('btndemo2');
    addEvent( d2, 'click', function(){

    	styleJSON.setup(
                {
                    fnFormatDate : function( date, el, df ){
                        var out = [], p;
                        for( p in dateFormat.masks ) el.append( styleJSON.Context( document.createElement('em') ).html( p + ': ' + dateFormat( date, dateFormat.masks[ p ] ) ) );
                    },
                    before : function(a,b,c){
                    	stopwatch.start();
                    }
                }
            )
    		.init( 'demo2', test3.filename, test3.style, function(a,b,c){
				showtime( c );
    		}
		);
    });

    var d3 = get('btndemo3');
    addEvent( d3, 'click', function(){

    	styleJSON.init('demo3', test4.filename, test4.style,
			{
				before: function(a,b,c){
					stopwatch.start();
				},
				completed: function(a,b,c){
					showtime( c );
	    		}
			}
		);
    });

    var d4 = get('btndemo4');
    addEvent( d4, 'click', function(){

    	styleJSON.init('demo4', test5.filename, test5.style, 
			{
				before: function(a,b,c){
					stopwatch.start();
				},
				completed: function(a,b,c){
					showtime( c );
	    		},
	    		masks : {
	    			date : {
	    				'created_at' : function(a,b){
	    					b.innerText = a.toDateString() + ' '+ a.toTimeString();
	    				}
	    			}
	    		}
			}
		);
    });

    var d5 = get('btndemo5');
    addEvent( d5, 'click', function(){

    	styleJSON.init('demo5', test6.filename, test6.style,
			{
				before: function(a,b,c){
					stopwatch.start();
				},
				completed: function(a,b,c){
					showtime( c );
	    		}
			}
		);
    });

    // demo 2 with different options
    var d6 = get('btndemo6');
    addEvent( d6, 'click', function(){
    	styleJSON.init( 'demo6', test3.filename, test3.style, 
            {
	            before : function(a,b,c){
	            	stopwatch.start();
	            },
	            completed : function(a,b,c){
					showtime( c );
	    		},
	            masks: {
            		special: {
            			'storeinfo': '<b class="what">%0</b>'
            		}
            	}
            }
		);
    });

})();