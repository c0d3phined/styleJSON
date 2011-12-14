(function(d){

	/* test id */
	var qnit = 'qunit-fixture',

	/* styleJSON Context fn */
		ctx = styleJSON.Context,

	/* utility fns */
		make = function( what ) { return document.createElement( what ); };


	/** 
	 * MODULE
	 * styleJSON Context object module 
	 */
	module( 'styleJSON.Context object [mainly for internal use]' );

	test( 'ctor', function(){
		expect(3);

		ok( styleJSON.Context( make('div') ), 'Context object constructor passed HTMLElement object.' );
		ok( styleJSON.Context( qnit ), 'Context object constructor passed element id.' );
		ok( ctx( qnit ).getId() > 0, 'get element\'s id' );
	});


	test( 'attr()', function(){
		var ele = ctx( make( 'div' ) );

		expect(3);

		ok( ele, 'Context element created ok' );									// is ok?
		ok( ele.attr( 'id', 'test1' ), '"test1" attribute added' );		// add test1 to id 
		equal( ele.attr('id'), 'test1', 'is element id == \'test1\'?');	// id == 'test1'
	});


	test( 'append()', function(){
		var ele = ctx( make( 'div' ) ).attr('id','test2'), ele2 = ctx( make( 'div' ) ).attr('id','test2b'), base = ctx( qnit );

		expect(3);

		ok( base.append( ele ), 'append element to itself' );			// no errors in append

		ok( base.append( ele2, true ), 'append element to itself and switch context to appended element' );
		deepEqual( base.ele, ele2.ele, 'is the context element now div#qunit-fixture?' );
	});


	test( 'appendTo()', function(){
		var ele = ctx( make( 'div' ) ).attr('id','test3'), ele2 = ctx( make( 'div' ) ), base = ctx( qnit );

		expect(4);

		ok( ele.appendTo( base ), 'append element to document.body operation' );			// no errors in appendTo
		equal( d.getElementById( 'test3' ), ele.ele, 'make sure the element made it to the DOM' );

		ok( ele2.appendTo( base, true), 'append element to document.body operation and switch context to document.body' );
		equal( ele2.ele, base.ele, 'is the context element now div#qunit-fixture?' );
	});


	test( 'detach()', function(){
		var base = ctx( qnit ), ele = ctx( make( 'div' ) ).attr('id','test4' ).appendTo( base );

		expect(2);

		ok( ele.detach(), 'remove element from DOM' );
		equal( d.getElementById( 'test4' ), null, 'equal to null if detach worked correctly.' );
	});


	test( 'children()', function(){
		expect(3);
		var demo = ctx( d.getElementById( qnit ) ), x;
		for( x=0; x<6; x++) demo.append( make( x != 0 ? 'span' : 'h1' ) );
		ok( demo.children( 'span' ), 'children of div#qunit-fixture that are span' );			// children of document.body operation
		equal( demo.children().length, 6, 'children.length == 6' );

		ok( demo.children( 'h1' ), 'children of div#qunit-fixture that are h1' );			// children of document.body operation
	});


	test( 'at()', function(){
		expect(5);
		var demo = ctx( d.getElementById( qnit ) ), x, span, n=5;
		for( x=0; x<n; x++) demo.append( make( 'span' ) );
		for( x=0; x<n; x++)  {
			span = demo.children( 'span' ).at( x );
			notEqual( span, null, 'span != null - child number '+x+' of div#qunit-fixture' );
		}
	});


	test( 'addClass()', function(){
		expect(3);
		var div = ctx( make( 'div' ) );
		ok( div.addClass( 'just-a-class' ), 'add a class' );
		ok( div.addClass( 'a-test-class another-class' ), 'add two classes' );
		equal( div.ele.className.split(' ').length, 3, 'are there three classes?' );
	});


	test( 'removeClass()', function(){
		expect(6);
		var div = ctx( make( 'div' ) );
		ok( div.addClass( 'just-a-class a-test-class another-class' ), 'add 3 classes' );
		equal( div.ele.className.split(' ').length, 3, 'there are three classes' );

		ok( div.removeClass( 'a-test-class' ), 'remove middle class' );
		equal( div.ele.className.indexOf('a-test-class'), -1, 'indexOf \'a-test-class\'' );
		ok( div.removeClass(), 'remove all classes' );
		equal( div.ele.className, '', 'all classes removed from className' );
	});


	test( 'text()', function(){
		expect(1);
		var div = ctx( d.getElementById( qnit ) ).text('Some sample text.');
		equal( div.text(), 'Some sample text.', 'set inner text of the element' );
	});


	test( 'html()', function(){
		expect(1);
		var html = '<span><em>Html</em>...is so 1996</span>',
			div = ctx( d.getElementById( qnit ) ).html( html );
		equal( div.html(), html, 'set inner text of the element' );
	});


	test( 'make()', function(){
		expect(2);
		var span = ctx( d.getElementById( qnit ) ).make('span');
		equal( span.id, '', 'new, un-wrapped HTMLElement object' );
		equal( span.outerHTML, '<span></span>', 'new, un-wrapped HTMLElement object\'s outerHTML' );
	});


	test( 'get()', function(){
		expect(1);
		var div = ctx( make( 'div' ) ).get( qnit );
		notEqual( div, null, 'matched element is not null' );
	});


	test( 'getId()', function(){
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
			style: 
            {
                "div":"name"
                // push down into furthest array
                ,key : "test.more.data"
                ,data: {
                	span : ["id","info"]
                }
            },
			'static array': [
		        { "id": 0123456789, "info": "some data" },
		        { "id": 0123456788, "info": "some more data" },
		        { "id": 0123456787, "info": "yet, even more data" }
	        ]
		}
	);

	test( 'styleJSON large object operation', function(){
		expect(3);
		var objects = [], i, sub, array = this['static array'], max = 150, alen = array.length, x, li,
			o = {"name" : "Daniel Brooks","test" : {"more" : {"data":[]}}};

		for( i = 0; i < max; i++ ) for( x = 0; x < alen; x++ ) objects.push( array[x] ); ;

		o.test.more.data = objects; // test more, pls

		sub = document.getElementById( qnit );
		styleJSON.init( sub, o, this.style, {
				maxnum : max,
				before: function(data, style, ele){
					debugger;
				},
				completed:function(data, style, ele){
					equals( ele.children('ul').at(0).children().length, max, '150 li elements created' );
					debugger;
					ok( li = ele.children('ul').at(0).children('li').at(0), 'first <li></li> element pulled out of the 150 [ ele.children(\'ul\').at(0).children(\'li\').at(0) ]' );
					equal( li.children('span').children().length, 2, 'each <li></li> is supposed to have two children nodes' );
				}
			}
		);
	});

	/* async test one */
//	module( 'styleJSON asynchronous test one', 
//		{
//			style: {
//				key : "items",
//				items : {
//					"div":["title","desc"]
//				}
//			},
//			data: '../../data/arraydata.simple.json'
//		}
//	);

//	var demo1, sj;
//	asyncTest( "styleJSON simple ajax call.", function(){
//
//		expect(6);
//
//		demo1 = document.getElementById('demo'), 
//			sj = styleJSON.init( demo1, this.data, this.style,
//				{
//					before : function(a,b,c){
//						ok( this.instances.length > 0 );
//					},
//		         	completed: function(a,b,c){
//		         		deepEqual( demo1, c.ele, "selector element & styleJSON Context" );
//
////		         		var ul = demo1.children[0];
//		         		var ul = c.children('ul').at( c.children().length-1 );
//
//		         		debugger;
//		         		equal( ul.ele.tagName.toLowerCase(), 'ul', "unordered list element exists" );
//		         		equal( ul.children().length, 3, "is equal to number of objects in data source" );
//
//		         		equal( ul.ele.children[0].children.length, 2, "number items in list." );
//		         		equal( ul.ele.children[0].children[0].innerText, "Item One", "text in the first element node of the first list." );
//		         		start();
//		         	}
//				}
//			);
//		}
//	);

})(document, undefined);