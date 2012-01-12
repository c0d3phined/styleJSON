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
                        "div":["title","id"],
                        span : {
                        	
                        }
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
        test3 = {
                style:
                    {
                        items:{
                            key: "items",
                            "div":["title","desc"]
                        }
                    },
                filename: 'data/arraydata.simple2.json'
        },

        // demo page example
        test4 = {
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
    	};

    /*
     * Level 1
     * level 1 style mockup and associated data file
     */
    var level1 = {
            style:
                {   // $(selector)
                    "span": ["author"]   // <span class="author">...
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
            filename: 'data/skills.json'
        },

    /*
     * Level 2
     * level 2 style mockup and associated data file
     * json data object is represented as "object"
     */
        level2 = {
            style :
                {   // $(selector)
                    "span": ["author"] // <span class="author">...
                    ,data: { // <div class="data">...
                        "span" : "title", // <span class="title">...
                        "div" : { // <div>...
                            key : "data.items", // map reference to the data

                            // <ul class="items">...
                            //   items is an array of objects in the json data object
                            //       each array object is wrapped in <li> element
                            // has to be named the last object map key object["data"]["items"]
                            items: { // has to be named the last object map key object["data"]["items"]
                               "span" : "title", // <span class="title">...
                               "div" : { // <div>...
                                   key : "experience", // object["data"]["items"]["experience"]

                                   // <ul class="experience">...
                                   //   experience is an array of objects in the json data object
                                   //       each object is wrapped in <li> element
                                   experience : {
                                           "span" : ["title","time"]
                                   } // </ul>...
                               } // </div>...
                            } // </ul>...
                        } // </div>...
                    } // </div>...
                },
            filename : 'data/skills.v2.json'
        },

    /*
     * Level 3
     * level 3 style mockup and associated data file.
     * json data object is represented as "object"
     */
        level3 = {
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
            filename : 'data/skills.full.json'
        };

/* not recommended */
//    $.style( test1.filename, test1.style );	// body test 

    $('.root').style( test4.filename, test4.style );    // simple array structure
    $('.root2').style( test2.filename, test2.style );
    $('.root3').style( level2.filename, level2.style );

});