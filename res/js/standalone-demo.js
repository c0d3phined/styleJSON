/**
 *  @author Daniel Brooks
 *  @desc demo style structures and script
 */

window.onload = function(){

/**
 * the point here is to keep the same structure
 * as the json object that you will be expecting.
 */

    var sj = styleJSON,
    	ctx = sj.Context,

    	test1 = {
            style:
            {
				key : "items",
				items : {
					"div":["title","desc"]
				}
            },
            filename: 'res/data/arraydata.simple.json'
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
            filename: 'res/data/datamine1.json'
        },


        // demo page example
        test3 = {
	    	style:
	    	{
				span : ["date month day year", "storeinfo"],
				div : {
					key : "data.books",
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
					"books" : [
	    	           {
	    	               "title": "The Creature From Jekyll Island : A Second Look at the Federal Reserve",
	    	               "isbn10" : 0912986212,
	    	               "lang": "English",
	    	               "author": "G. Edward Griffin",
	    	               "link" : "http:\/\/www.amazon.com\/Creature-Jekyll-Island-Federal-Reserve\/dp\/0912986212\/ref=sr_1_1?s=books&ie=UTF8&qid=1324800615&sr=1-1"
	    	           },
	    	           {
	    	               "title": "Brave New World",
	    	               "isbn10" : 0060850523,
	    	               "lang": "English",
	    	               "author": "Aldous Huxley",
	    	               "link" : "http:\/\/www.amazon.com\/Brave-New-World-Aldous-Huxley\/dp\/0060850523\/ref=sr_1_1?ie=UTF8&qid=1324800550&sr=8-1"
	    	           },
	    	           {
	    	               "title": "Confessions of an Economic Hitman",
	    	               "isbn10" : 0452287081,
	    	               "lang": "English",
	    	               "author": "John Perkins",
	    	               "link" : "http:\/\/www.amazon.com\/Confessions-Economic-Hit-John-Perkins\/dp\/1576753018"
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
            filename: 'res/data/interests.json'
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
			filename : 'res/data/twitter.sample1.json'
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
            filename : 'res/data/skills.full.json'
    	},

    	test7 = {
    		style: 
            {
                "div":"desc"
                , dates: {
                	div : ["ISO8601","dotNETstyle"]
                }
            },
    		filename: 'res/data/dates.json'
    	},
    	
    	test8 = {
    		style: {
    			div: {
    				span:['from', 'text'], 
    				img: 'imageurl'
				}
			},
    		filename: 'res/data/twitter.sample2.json'
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

    function get( id ) { return document.getElementById( id ); }

    function showtime( ele ) {
    	var w = '-watch', li = ele.ele.parentNode, 
    		div = styleJSON.Context( document.getElementById( ele.attr( 'id' ) + w ) || document.createElement( 'div' ) ), 
    		txt = 'execution time:'+ stopwatch.getTime() + 'ms';
    	div.addClass( 'stopwatch' ).attr( 'id', ele.attr( 'id' ) + w ).text( txt );

    	li.insertBefore( div.ele, ele.ele );
    }

    var d1 = get('btndemo1');
    styleJSON.addEvent( d1, 'click', function(){
    	styleJSON.init('demo1', test2.filename, test2.style ,{before: function(){stopwatch.start();},completed:function(a,b,e){ showtime( e ); }});
    });

    var d2 = get('btndemo2');
    styleJSON.addEvent( d2, 'click', function(){

    	styleJSON.init( 'demo2', test3.filename, test3.style,
			{
                fnFormatDate : function( date, el, df ){
                    var out = [], p;
                    for( p in dateFormat.masks ) el.append( styleJSON.Context( document.createElement('em') ).html( p + ': ' + dateFormat( date, dateFormat.masks[ p ] ) ) );
                },
                before : function(a,b,c){
                	stopwatch.start();
                },
                completed: function(a,b,c){
                	showtime( c );
                }
    		}
		);
    });

    var d3 = get('btndemo3');
    styleJSON.addEvent( d3, 'click', function(){

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
    styleJSON.addEvent( d4, 'click', function(){

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
	    					if ( a.toDateString ) b.innerText = a.toDateString() + ' '+ a.toTimeString();
	    					else b.innerText = a;
	    				}
	    			},
	    			events : {
	    				'created_at' : {
	    					click : function(e){
	    						console.log( '>click ' );
	    					},
	    					over : function(e){
	    						console.log( '>mouse over ' );
	    					},
	    					out : function(e){
	    						console.log( '>mouse out ' );
	    					}
	    				}
	    			}
	    		}
			}
		);
    });

    var d5 = get('btndemo5');
    styleJSON.addEvent( d5, 'click', function(){

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
    styleJSON.addEvent( d6, 'click', function(){
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
            			'storeinfo': '<div>Some injected text & HTML...</div><span>%0</span>'
            		},
            		date: {
            			'date' : function(a,b){
            				b.innerText = Date.fromDotNetJSONDate( a );
            			}
            		}
            	}
            }
		);
    });

    // demo 2 with different options
    var d7 = get('btndemo7');
    styleJSON.addEvent( d7, 'click', function(){
    	styleJSON.init( 'demo7', test7.filename, test7.style, 
            {
	            before : function(a,b,c){
	            	stopwatch.start();
	            },
	            completed : function(a,b,c){
					showtime( c );
	    		},
	            masks: {
	            	special: {
	            		'ISO8601' : function(a,b,c){
	            			b.append(+
	            					ctx( document.createElement('em') ).text( a+' -> ')
            					)
	            				.append(
            						ctx( document.createElement('span') )
	    								.text( dateFormat( Date.parseISO8601( a ), 'm/d/yy h:MM:ss TT' ) )
	            				);
	            		}
	            	},
            		events: {
            			'desc' : {
            				mouseover : function(a,b){
            				},
            				mouseout : function(a,b){
            				}
            			},
            			'dotNETstyle' : {
            				mouseover : function(a,b){
            				},
            				mouseout : function(a,b){
            				}
            			}
            		}
            	}
            }
		);
    });


    // demo 2 with different options
    var d8 = get('btndemo8');
    styleJSON.addEvent( d8, 'click', function(){
    	styleJSON.init( 'demo8', test8.filename, test8.style, 
            {
	            before : function(a,b,c){
	            	stopwatch.start();
	            },
	            completed : function(a,b,c){
					showtime( c );
	    		},
	            masks: {
            		special: {
            			'text': function(txt, cele, ele ) {
            				var hash = /(\u0023+\w*)/gi, user =/(\u0040+\w*)/gi; 
            				if ( hash.test( txt ) ) {
            					txt = txt.replace( hash, "<span class=\"hashtag\">$1</span>" );
            				}

            				if ( user.test( txt ) ) {
            					txt = txt.replace( user, "<span class=\"user\">$1</span>" );
            				}

            				cele.html( txt );
            			}
            		}
            	}
            }
		);
    });

};