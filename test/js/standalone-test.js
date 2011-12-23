(function(d){

	/* test id */
	var qnit = 'qunit-fixture',

	/* styleJSON Context fn */
		ctx = styleJSON.Context,

	/* utility fns */
	   	 // http://jdev.blogsome.com/2006/08/18/compact-script-to-calculate-script-execution-time/
		_stopwatch = {
			d:null,
			time:null,
 			start:function (){
	   	        this.d = new Date();
	   	        this.time = this.d.getTime();
 			},
   	    	getTime: function (){
   	    		this.d = new Date();
	   	    	return (this.d.getTime()-this.time);
   	    	}
   	 	},
		_teardown= function(){
        	// reset styleJSON element id so the data is not re-used by the plugin.
        	document.getElementById('qunit-fixture').setAttribute('sj-id', '' );
        },
		make = function( what ) { return document.createElement( what ); };


	/** 
	 * MODULE
	 * styleJSON Context object module 
	 */
	module( 'styleJSON.Context object [mainly for internal use]',{
		ctx : styleJSON.Context
	});

	test( ' - ctor', function(){
		expect(3);

		ok( styleJSON.Context( make('div') ), 'Context object constructor passed HTMLElement object.' );
		ok( styleJSON.Context( qnit ), 'Context object constructor passed element id.' );
		ok( ctx( qnit ).getId() > 0, 'get element\'s id' );
	});


	test( ' - attr()', function(){
		var ele = ctx( make( 'div' ) );

		expect(3);

		ok( ele, 'Context element created ok' );									// is ok?
		ok( ele.attr( 'id', 'test1' ), '"test1" attribute added' );		// add test1 to id 
		equal( ele.attr('id'), 'test1', 'is element id == \'test1\'?');	// id == 'test1'
	});


	test( ' - append()', function(){
		var ele = ctx( make( 'div' ) ).attr('id','test2'), ele2 = ctx( make( 'div' ) ).attr('id','test2b'), base = ctx( qnit );

		expect(3);

		ok( base.append( ele ), 'append element to itself' );			// no errors in append

		ok( base.append( ele2, true ), 'append element to itself and switch context to appended element' );
		deepEqual( base.ele, ele2.ele, 'is the context element now div#qunit-fixture?' );
	});


	test( ' - appendTo()', function(){
		var ele = ctx( make( 'div' ) ).attr('id','test3'), ele2 = ctx( make( 'div' ) ), base = ctx( qnit );

		expect(4);

		ok( ele.appendTo( base ), 'append element to document.body operation' );			// no errors in appendTo
		equal( d.getElementById( 'test3' ), ele.ele, 'make sure the element made it to the DOM' );

		ok( ele2.appendTo( base, true), 'append element to document.body operation and switch context to document.body' );
		equal( ele2.ele, base.ele, 'is the context element now div#qunit-fixture?' );
	});


	test( ' - detach()', function(){
		var base = ctx( qnit ), ele = ctx( make( 'div' ) ).attr('id','test4' ).appendTo( base );

		expect(2);

		ok( ele.detach(), 'remove element from DOM' );
		equal( d.getElementById( 'test4' ), null, 'equal to null if detach worked correctly.' );
	});


	test( ' - children()', function(){
		expect(3);
		var demo = ctx( d.getElementById( qnit ) ), x;
		for( x=0; x<6; x++) demo.append( make( x != 0 ? 'span' : 'h1' ) );
		ok( demo.children( 'span' ), 'children of div#qunit-fixture that are span' );			// children of document.body operation
		equal( demo.children().length, 6, 'children.length == 6' );

		ok( demo.children( 'h1' ), 'children of div#qunit-fixture that are h1' );			// children of document.body operation
	});


	test( ' - at()', function(){
		expect(5);
		var demo = ctx( d.getElementById( qnit ) ), x, span, n=5;
		for( x=0; x<n; x++) demo.append( make( 'span' ) );
		for( x=0; x<n; x++)  {
			span = demo.children( 'span' ).at( x );
			notEqual( span, null, 'span != null - child number '+x+' of div#qunit-fixture' );
		}
	});


	test( ' - addClass()', function(){
		expect(3);
		var div = ctx( make( 'div' ) );
		ok( div.addClass( 'just-a-class' ), 'add a class' );
		ok( div.addClass( 'a-test-class another-class' ), 'add two classes' );
		equal( div.ele.className.split(' ').length, 3, 'are there three classes?' );
	});


	test( ' - removeClass()', function(){
		expect(6);
		var div = ctx( make( 'div' ) );
		ok( div.addClass( 'just-a-class a-test-class another-class' ), 'add 3 classes' );
		equal( div.ele.className.split(' ').length, 3, 'there are three classes' );

		ok( div.removeClass( 'a-test-class' ), 'remove middle class' );
		equal( div.ele.className.indexOf('a-test-class'), -1, 'indexOf \'a-test-class\'' );
		ok( div.removeClass(), 'remove all classes' );
		equal( div.ele.className, '', 'all classes removed from className' );
	});


	test( ' - text()', function(){
		expect(1);
		var div = ctx( d.getElementById( qnit ) ).text('Some sample text.');
		equal( div.text(), 'Some sample text.', 'set inner text of the element' );
	});


	test( ' - html()', function(){
		expect(1);
		var html = '<span><em>Html</em>...is so 1996</span>',
			div = ctx( d.getElementById( qnit ) ).html( html );
		equal( div.html(), html, 'set inner text of the element' );
	});


	test( ' - make()', function(){
		expect(3);
		var span = ctx( d.getElementById( qnit ) ).make('span');
		equal( span.tagName.toLowerCase(), 'span', 'is the element a span?' );
		equal( span.id, '', 'new, un-wrapped HTMLElement object' );
		equal( span.innerHTML, '', 'new, un-wrapped HTMLElement object\'s outerHTML' );
	});


	test( ' - get()', function(){
		expect(1);
		var div = ctx( make( 'div' ) ).get( qnit );
		notEqual( div, null, 'matched element is not null' );
	});


	test( ' - getId()', function(){
		expect(2);
		var div = ctx( make( 'div' ) ), date;
		ok( div.getId() > 0, 'element\'s id exists' );

		date = new Date( div.getId() );
		equal( date.getTime(), div.getId(), 'equal if id is pulled since id is derived from getTime' );
	});

/**
 * MODULE
 * styleJSON object data-source
 */
	module( 'styleJSON object data-source',{
			sj : styleJSON,
			style: 
            {
                "div":"name"
                // push down into furthest array
                ,key : "test.more.data"
                ,data: {
                	span : ["id","info"]
                }
            },

            /* multiclass style */
            'style multiclass': 
            {
                "div":"name"
                // push down into furthest array
                ,key : "test.more.data"
                ,data: {
                	span : ["id another-class","info text"]
                }
            },

           /* dates style */
            'style_dates': 
            {
                "div":"desc"
                , dates: {
                	div : ["ISO8601","dotNETstyle"]
                }
            },

            /* static array data */
			'static array': [
		        { "id": 0123456789, "info": "some data" },
		        { "id": 0123456788, "info": "some more data" },
		        { "id": 0123456787, "info": "yet, even more data" }
	        ],

	        datedata: {
	            "desc" : "different styles of dates as they appear in JSON",
	            "dates" : {
	                "ISO8601" : "2008-01-28T20:24:17Z",
	                "dotNETstyle" : "\/Date(1314151709000)\/"
	            }
	        },

	        teardown:_teardown,

	   	 	stopwatch : _stopwatch
		}
	);

	test( ' - large object operation', function(){
		expect(4);
		var objects = [], i, sub, array = this['static array'], max = 150, alen = array.length, x, li,
			o = {"name" : "Daniel Brooks","test" : {"more" : {"data":[]}}};

		for( i = 0; i < max; i++ ) for( x = 0; x < alen; x++ ) objects.push( array[x] ); ;

		o.test.more.data = objects; // test more data pls

		sub = document.getElementById( qnit );
		this.sj.init( sub, o, this.style, {
				maxnum : max,
				completed:function(data, style, ele){
					equals( ele.children('ul').at(0).children().length, max, '150 li elements created' );
					ok( li = ele.children('ul').at(0).children('li').at(0), 'first <li></li> element pulled out of the 150 [ ele.children(\'ul\').at(0).children(\'li\').at(0) ]' );
					equal( li.children('span').children().length, 2, 'each <li></li> is supposed to have two child nodes' );
					equal( li.children('span').at(1).text(), 'some data', 'test the equality of text from the first li element\'s first child\'s text' );
				}
			}
		);
	});


	test( ' - multi-class test', function(){
		expect(4);
		var sub, li, n, o = {"name" : "Daniel Brooks","test" : {"more" : {"data": this['static array'] }}};

		sub = document.getElementById( qnit );
		this.sj.init( sub, o, this['style multiclass'], {
				completed:function(data, style, ele){
					equals( ele.children('ul').at(0).children().length, 3, '3 li elements created' );
					ok( li = ele.children('ul').at(0).children('li').at(0), 'first <li></li> element pulled out of the 150 [ ele.children(\'ul\').at(0).children(\'li\').at(0) ]' );
					equal( n = li.children('span').children().length, 2, 'each <li></li> is supposed to have two children nodes' );
					equal( li.children('span').at(0).attr('class').split(' ').length, 2, 'are there two classes on the element?' );
				}
			}
		);
	});


	test( ' - date parsing', function(){
		stop();
		expect(1);
		var sub = document.getElementById( qnit );

		this.sj.init( sub, this.datedata, this['style_dates'], {
				completed:function(data, style, ele){
					ok( typeof dateFormat === 'function', 'typeof dateFormat === \'function\'.  dateFormat library was loaded successfully.' );
//					debugger;
					start();
//					equals( ele.children('ul').at(0).children().length, 3, '3 li elements created' );
//					ok( li = ele.children('ul').at(0).children('li').at(0), 'first <li></li> element pulled out of the 150 [ ele.children(\'ul\').at(0).children(\'li\').at(0) ]' );
//					equal( n = li.children('span').children().length, 2, 'each <li></li> is supposed to have two children nodes' );
//					equal( li.children('span').at(0).attr('class').split(' ').length, 2, 'are there two classes on the element?' );
				}
			}
		);
	});


	test( ' - embedded link-in-text parsing', function(){
		expect(1);
		var sub = document.getElementById( qnit );
		this.sj.init( sub, { link : "http:\/\/t.co\/xMmYW2Tv" }, { div : 'link' }, {
				completed:function(data, style, ele){
					ok( ele.children('div').at(0).html() == "<a href=\"http://t.co/xMmYW2Tv\">http://t.co/xMmYW2Tv</a>", 'raw link transformed into <a href=\"http://t.co/xMmYW2Tv\">http://t.co/xMmYW2Tv</a>' );
				}
			}
		);
	});


	test( ' - HTML anchor link element parsing', function(){
		expect(1);
		var sub = document.getElementById( qnit );
		this.sj.init( sub, { link : "<a href=\"http:\/\/t.co\/xMmYW2Tv\" target=\"_blank\">Ron Paul Over 30 Years</a>" }, { div : 'link' }, {
				completed:function(data, style, ele){debugger;
					var html = ele.children('div').at(0).html();
					ok( html == data.link, 'HTML link used from raw data : '+ data.link );
				}
			}
		);
	});


/**
 * MODULE
 * styleJSON mask tests
 */
	module( 'styleJSON masks\' tests',{
		sj : styleJSON,
		style: 
        {
            "div":"name"
            // push down into furthest array
            ,key : "test.more.data"
            ,data: {
            	span : ["id","info"]
            }
        },

		data: {
			"name" : "Daniel Brooks",
			"test" : {
				"more" : {
					"data": [
				         { "id": '0123456789', "info": "some data" },
	                     { "id": '0123456788', "info": "some more data" },
	                     { "id": '0123456787', "info": "yet, even more data" }
                     ]
				}
			}
		},

        teardown:_teardown
	});

	test( ' - event masking test', function(){

		for( var z = 0; z < 6; z++ ) stop();

		expect(4);
		var sub, li, span1, span2, o = {},
			dummyFunc = function(){ start(); return false; };

		sub = document.getElementById( qnit );
		this.sj.init( sub, this.data, this.style, {
				masks : {
					events:{
						'id' : {
							mouseover:dummyFunc,
							mouseout:dummyFunc,
							mouseup:dummyFunc,
							mousedown:dummyFunc,
							click:dummyFunc,
							dblclick:dummyFunc
						}
					}
				},
				completed:function(data, style, ele){
					ok( li = ele.children('ul').at(0).children('li').at(0), 'first <li></li> element pulled out of the 150 [ ele.children(\'ul\').at(0).children(\'li\').at(0) ]' );
					ok( span1 = li.children('span').at(0), 'child at index 0 exists' );
					ok( span2 = li.children('span').at(1), 'child at index 1 exists' );

					var el = span1.ele, ev = el.trackedEvents, e, n, x = 0;
					for( var e in ev ) {
						x++;
						if ( ev[e].length > 0 ) for( n=0, nlen = ev[e].length; n < nlen; n++) el[ e ]();
					}
					equal( x, 6, 'number of events fired that were applied to element.' );
				}
			}
		);
	});


	test( ' - special text masking test', function(){

		var expected = '<em>This is the id: 0123456789</em>';
		expect(3);
		this.sj.init( qnit, this.data, this.style, {
				masks : {
					special:{
						'id' : '<em>This is the id: %0</em>'
					}
				},
				completed:function(data, style, ele){
					ok( li = ele.children('ul').at(0).children('li').at(0), 'first <li></li> element pulled out of the 150 [ ele.children(\'ul\').at(0).children(\'li\').at(0) ]' );
					ok( span1 = li.children('span').at(0), 'child at index 0 exists' );
					equal( span1.html(), expected, 'innerText = '+expected +'. \nSpecial mask succeeded.');
				}
			}
		);
	});


/**
 * MODULE
 * styleJSON object data-source speed tests
 */
	module( 'styleJSON JIT object-datasource speed tests',{
        teardown:_teardown,
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
    	data:
		{
			"storeinfo" : "A Random Bookstore",
			"date" : "\/Date(1320540472000)\/",
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
		},
        teardown:_teardown,
   	 	stopwatch : _stopwatch
	});


	test(' - object-datasource speed test', function(){
		expect(2);
		var that = this, sub = document.getElementById( qnit );
		styleJSON.init( sub, this.data, this.style, {
				before : function(){ stop(); that.stopwatch.start(); },
				completed:function(data, style, ele){
					var time = that.stopwatch.getTime();
					start();
					ok( time <= 100, 'time to parse is less than or equal to 100ms ( includes lazy-loading { using <script></script> tags to load } the dateFormat library )' );
					equal( time+'ms', time+'ms', "just to show value. Time in milliseconds to parse data and insert into DOM." );
				}
			}
		);
	});


/**
 * MODULE
 * styleJSON async tests
 */
	module( 'styleJSON asynchronous tests', 
		{
			style: {
				key : "items",
				items : {
					"div":["title","desc"]
				}
			},
			failfile: '../../data/nofile.json',
			data: '../../data/arraydata.simple.json',
	        teardown:_teardown
		}
	);

	asyncTest( " - remote data, ajax.", function(){

		expect(5);
		var demo1 = document.getElementById( qnit ), 
			sj = styleJSON.init( demo1, this.data, this.style,
				{
		         	completed: function(a,b,c){
		         		deepEqual( demo1, c.ele, "selector element & styleJSON Context" );

		         		var ul = c.children('ul').at( c.children().length-1 );

		         		equal( ul.ele.tagName.toLowerCase(), 'ul', "unordered list element exists" );
		         		equal( ul.children().length, 3, "number of list items are equal to number of objects in data source" );

		         		equal( ul.children('li').at(0).children().length, 2, "number items in list." );
		         		equal( ul.children('li').at(0).children('div').at(0).text(), "Item One", "text in the first element node of the first list." );
		         		start();
		         	}
				}
			);
		}
	);

//	asyncTest( "- purposely failed remote data test", function(){
//		expect(1);
//		var file = this.failfile, style = this.style;
//		ok( styleJSON.init( qnit, file, style, function(a,b,c){ }) );
//	});

})(document, undefined);