var styleJSON = {};
// styleJSON
(function(){

	// add Object.keys if doesn't exist
	if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o))
            throw new TypeError('Object.keys called on non-object');
        var ret=[],p;
        for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
        return ret;
    };

    Date.fromJSONDate = function( jsonDate ){
    	return eval( jsonDate.replace( /\/Date\((-?\d+)\)\//gi, "new Date($1)" ) );
    };

	this.Context = function( ele ) {

		var ele = typeOf( ele ) == 'object' ? ele : ( typeof ele == 'string' ? document.getElementById( ele ) : null );
		if ( null == ele ) return debug( (new TypeError('Error> styleJSON.Context passed non-object and non-string.') ).message );

		function _context( e ) {

			var _ctx = null, // element context
				_children = [],
				_handleArray = function(){
				for( var i = 0, a = [].slice.call( arguments ), fn = a[0], arg1 = a[1], clen = _ctx.length; i < clen; i++){
					fn( arg1 );
				}
			};

			function init( e ){
				_ctx = e;
				return this;
			}

			this.setCtx = function(c) { _ctx = this.ele = c; };
			this.getCtx = function() { return _ctx; };

			// can get an element by id or get and change context to the found element.
			this.get = function( a, switchCtx ){
				var o = document.getElementById( a ) || null;
				if ( !switchCtx ) return o;
				else _ctx = this.ele = o;

				return this;
			};

			this.make = function( a ){
				return document.createElement( a );
			};

			this.children = function( a ) {
				_children = [];
				for ( var l = _ctx.children.length, nodes = _ctx.children, x = 0; x < l; x++) {
					if ( a == nodes[ x ].tagName.toLowerCase() )
						_children[_children.length] = nodes[ x ];
				}

				return this;
			};

			// returns element at the index
			this.at = function( i ) {
				return isArray( _children ) ? styleJSON.Context( _children[ i ] ) : null;
			};

			this.detach = function() {
				var p = _ctx.parentNode;
				if ( p ) p.removeChild( _ctx );

				return this;
			};

			// append an element or append and change context to that element.
			this.append = function( y, switchCtx ) {
				if ( typeof y == 'object' ) y = _ctx.appendChild( y.ele || y );
				else if ( typeof y == 'string' ) y = _ctx.appendChild( this.make( y ) );

				this.setCtx( switchCtx ? y : _ctx );

				return this;
			};

			// append to an element or append to and change context to the target element.
			this.appendTo = function( y, switchCtx ) {
				var x = y;
				if ( typeof y == 'object' ) y.ele.appendChild( _ctx );
				else if ( typeof y == 'string' ) this.get( y ).appendChild( _ctx );

				this.setCtx( switchCtx ? x : _ctx );

				return this;
			};

			this.text = function( a ){ _ctx.innerText = a; return this; };

			this.html = function( a ) { _ctx.innerHTML = a; return this; };

			this.removeClass = function( a ){
				if ( a != '' ) {
					var cl = _ctx.className, cns = cl != '' ? cl.split(' ') : [], len = n = cns.length;
					while(n--){
						if ( cns[n] == a ) cns[n] = '';
					}
					_ctx.className = cns.join(' ');
				}
				return this;
			};

			this.addClass = function( c ) {
				if ( c != '' ) {
					var cn = _ctx.className, cns = cn != '' ? cn.split(' ') : [], l = cns.length;
					if ( l > 0 ){
						cns[ l ] = c;
						cn = cns.join(' ');
					} else cn += (cn != '' ? ' ' : '') + c;
					_ctx.className = cn;
				}

				return this;
			};

			this.attr = function( attr, val ){
				if ( val ) _ctx.setAttribute( attr, val );
				else return _ctx.getAttribute( attr ) || null;
 
				return this;
			};

			return init.call( this, ele );
		}

		return _context.call( { ele: ele || null } );
	};


    function make( ele ) {
    	return styleJSON.Context( document.createElement( ele ) );
    }

	function typeOf( o ) {
    	if ( typeof o == 'undefined' ) return 'undefined';
    	if ( o == null ) return 'null'; // "fix" javascript's typeof null === 'object' gotcha
    	var type = typeof o;

    	switch( type ) {
		default: return type;

    	case 'object':
    		return ( isArray( o ) ? 'array' : 'object' );
    	}
	}

    function dressArrayData( arr ) { return { items : arr }; }

    function dressTemplate( o ) { if ( o['key'] ) return o; else return { key: "items", items : o }; }

    function preprocess( array, template ) {
		if ( isArray( array ) ) {
			return {
				data: dressArrayData( array ),
				template: dressTemplate( template )
			};
		} else return { data: array, template: template };
    }

	function formatDate( date, el, ddf ) {
		if ( instance.defaults.fnFormatDate ) instance.defaults.fnFormatDate( date, el, ddf );
		else {
			date = dateFormat( date, ddf );
			el.text( date );
		}
	}

	function merge( a, b ){
		for ( var p in a ) b[p] = ( typeOf( a[p] ) == 'object' ? merge( a[p], b[p] || {} ) : a[p] );
		return b;
	}

    function getTime() {
    	return new Date().getTime();
	}

    function isArray( o ) {
    	if ( o && o.length >= 0 ) return true;
    	else return false; 
    }

    function lazyload( type, txt, ele ) {
		var sc = make( type ), s = sc.ele, h = document.getElementsByTagName( type )[0];

		s.async = s.src = instance.defaults.dateFormatPath; // 'truthy' async value = true

		// using jQuery's onload/onreadystatechange fix
		s.onload = s.onreadystatechange = function( ) {

			if ( !s.readyState || /loaded|complete/.test( s.readyState ) ) {

				// use custom function
				formatDate( txt, ele, instance.defaults.dateFormat );

				// Handle memory leak in IE
				s.onload = s.onreadystatechange = null;

				// Remove the script
				if ( s.parentNode ) {
					s.parentNode.removeChild( s );
				}

				// Dereference the script and references
				sc = s = ele = txt = undefined;
			}
		};

		h.parentNode.insertBefore( s, h );
    }

	function _findInstance( _arguments  /** HtmlElement|HtmlElement ID, json_data, template, options|callback */, _allinst, _defaults ) {
		args = [].slice.call( _arguments );

		// get selected element
		var ilen, b = document.body,
			m = typeOf( args[0] ) == 'string' ? document.getElementById( args[0] ) || b : 
				( typeOf( args[0] ) == 'object' ? args[0].ele || args[0] : b ),
			id = parseInt( m.getAttribute('sj-id') || getTime() ), 
			defs = defaults = typeOf( args[3] ) == 'function' ? merge( { completed: args[3] }, _defaults ) :
				( typeOf( args[3] ) == 'object' ? merge( args[3], _defaults ) :  _defaults );

		if ( ~(_allinst.length-1) ) {
        	ilen = _allinst.length;
        	while (ilen--) {
        		if ( _allinst[ ilen ].instanceid == id ) {
        			defaults = _allinst[ ilen ].defaults; // set defaults to current instance
        			return _allinst[ ilen ];
        		}
        	}
    	}

		return _makeInstance( args[1], args[2], m, id, defs, _allinst );
	}

	function _makeInstance( data, template, matched, id, _defaults, _allinstances ) {

		if ( typeOf( data ) == 'string' ) {
			sj.xhr.call( sj, data, function(a,b,c){
				instance = _makeInstance( a, template, matched, id, _defaults, _allinstances );
				_init.call( that, instance );
			});
			return undefined;
		}

		var _inst, o = preprocess( data, template );

		_allinstances.push( _inst = { data: o.data, template: o.template, callback: _defaults.completed, matched: ( matched.ele ? matched : styleJSON.Context( matched ) ), instanceid: id, defaults : _defaults } );

		_inst.matched.attr( 'sj-id', id ); // assign element id
		_instances = _allinstances; // assign global
		o = matched = _defaults = _allinstances = undefined; // garbage collect

		return _inst;
	}

    function debug(msg){
		if ( console && console.log ) console.log( msg );
    }

    function reset(){
    	defaults = merge( _defsbak, {} );
    }

    function _init( inst /** instance */ ){
    	var m = inst.matched, d = inst.data, t = inst.template;
    	if ( inst.defaults.before ) inst.defaults.before.call( this, d, t, m );
		sj.look.call( sj, t, d, m );
		if ( inst.callback ) inst.callback.call( this, d, t, m );
		reset();
    }

	function searchObj( ctxprop, mask ){
		var t = typeOf( mask ), m;
		switch( t ){
		case 'object':
				for( var p in mask ) {
					if ( p == ctxprop ) return mask[p];
				}
			break;
		}
		return false;
	}
	/* end utility functions */


	var that = this, instance = null,
		_instances = [], args = [],
        omap = (function(){ return 'section legend span div em h1 h2 h3 p pre i b q s sub sup ul ol li a abbr cite code footer header strong small label address article blockquote fieldset'.split( ' ' ); })(),
        arrayTags = 'ol ul'.split( ' ' ), linkTag = 'a',
        isArrayTag = function( str ) {return /ul|ol|li/gi.test(str);},
        isLink = function( str ) { return /http:/im.test(str); },
        isHTMLLinkTag = function( str ) {return /<a[^>]*>(.*?)<\/a>/gi.test(str);},
        isMultiClass = function( str ) { return str ? ( str.split( ' ' ).length > 1 ) : false; },
        isDateString = function( d ){ return /Date\(\d*\)/g.test( d ); },
        isDateFormatLoaded = function(){ try{ if ( typeOf( dateFormat ) == 'function' ) return true; else return false;}catch(e){return false;} },
		defaults = {

			// HTML tag to wrap around a link when a string containing
			// 'http://[...]' exists and is parsed into an anchor (<a>) element
			linkWrapTag : "div",

			// default array tag to use for arrays 
			useArrayTag : "ul",

			// JavaScript Date Format
			// http://blog.stevenlevithan.com/archives/date-time-format
			// use Date Format script for formatting dates
			useDateFormat: true,

			// path to date.format.js
			dateFormatPath: "js/date.format.js",

			// user-defined function for custom date formatting
			fnFormatDate : null,

			// format for the dateFormat script
			dateFormat : "dddd, mmmm d, yyyy",

			// strip nodes that it's associated data is not found or is an empty string
			stripEmptyNodes : true,

			// callback before operation begins, after any XHR GET requests,
			// so you have access to the data
			before: null,

			// callback on full operation completion 
			completed: null,

			// force a mask on a node, in other words, custom 
			//	handling of node with matching property name
			masks : {
				// array of properties to apply date parsing to
				date : null,
				events : {},
				special: {}
			}
		},
		_defsbak = function(d){var o = merge( d, {} ); if ( Object.freeze ) return Object.freeze( o ); else return o; }(defaults),

		// main program
		sj = {

	        /**
	         * XHR Request function
	         * @param {String} url The url to the JSON data to fetch.
	         * @param {Function} fn The complete callback function.  
	         * @returns {?Object}
	         */
    		xhr : function( url, fn, type ){
    			var req, urlstr = '?_='+ new Date().getTime(), url = url + urlstr,
    				fn = fn || function(){};
				type = !type ? 'json' : type;

    			try {
    	            req = new XMLHttpRequest();
    	        } catch ( e1 ) {
    	            try {
    	            	req = new ActiveXObject("Msxml2.XMLHTTP");
    	            } catch( e2 ) {
    	                for (var success = false, 
    	                		ie = 'Microsoft.XMLHTTP MSXML2.XMLHTTP MSXML2.XMLHTTP.5.0 MSXML2.XMLHTTP.4.0 MSXML2.XMLHTTP.3.0'.split(' '),
    	                		len = ie.length,
    	                		i=0;i < len && !success; i++) {
    	                    try {
    	                        req = new ActiveXObject( ie[ i ] );
    	                        success = true;
    	                    } catch ( e3 ) {
    	                    	req = null;
    	                    }
    	                }
    	            }
    	        }

    	        if ( !req ) return false;

    	        var complete = function( a ){
    	        	if ( a.currentTarget.readyState == 4 ) {
    	        		var t = a.currentTarget.responseText, data;

    	        		switch (type) {

    	        		case 'json':
        	        		if ( JSON && JSON.parse ) data = JSON.parse( t );
        	        		else data = eval( '(' + t + ')');
    	        			break;
    	        		}

    	        		fn.call( this, data, t, a );

    	        		req = data = a = undefined;
    	        	}
    	        };
    	        req.onreadystatechange = complete;

    	        try {
    	        	req.open( 'GET', url, true);
        	        if ( typeOf( req.setRequestHeader ) !== "undefined" ){ // Opera can't setRequestHeader()
                        if ( typeOf( req.overrideMimeType === "function" ) ) {
                        	req.overrideMimeType('application/json');
                        }
                        req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                    }
        	        req.send( url );
                } catch (e) {
                	debug(e); 
                }
    		},

	        /**
	         * Attempt to "drill down" into a data source by the given key
	         * @param {String} key String of names delimited by a period to 'drill-down' into a data source with.
	         * @param {Object} obj The data source object to attempt drilling down into. 
	         * @returns {?Object}
	         */
			drillDown: function( key, obj ) {
				var arr = key.split('.'), arrlen = arr.length, o = obj;

	            for (var i = 0; i < arrlen; i++) {
	                if ( o[ arr[i] ] ){
	                    o = o[ arr[i] ];
	                }
	            }

	            return o;
	        },


	        /**
	         * process keys
	         */
	        processKey : function( arr, ele, parent ){
    			for ( var _parent =  parent ? parent : ele, len = ( arr && isArray( arr ) ) ? arr.length : 0, x = 0; x < len; x++ ) {
    				make( ele.ele.tagName.toLowerCase() ).appendTo( _parent );
    			}
	        },


	        /**
	         * Parse a JSON date string and add parsed text to given element
	         * @param {String} txt Formatted Date string NOT in ISO8601
	         * @param {jQuery} ele jQuery wrapped element to operate on.
	         */
	        parseDate: function( txt, ele ){
	        	try{
	        		txt = Date.fromJSONDate( txt );
	        		isDate = true;

	        		if ( instance.defaults.useDateFormat && isDateFormatLoaded() ) formatDate( txt, ele, instance.defaults.dateFormat );
	        		else lazyload( 'script', txt, ele ); // lazy-load the date format script
	        	} catch(e){
	        		debug('Error> Date string parse error.');
	        	}
	        },


	        /**
	         * 
	         * @param txt
	         * @param ele
	         * @param to
	         * @param property
	         * @param ctxprop
	         */
	        parseText : function( txt, ele, to, property, ctxprop ) {
	        	if ( txt == '' ) return;

	        	var dateMask = searchObj( ctxprop, instance.defaults.masks.date ),
	        		txtMask = searchObj( ctxprop, instance.defaults.masks.special );

            	if ( isHTMLLinkTag( txt ) ) {	// <a></a>
            		ele.html( txt );
            		return;
        		}

            	if ( isLink( txt ) ) { // http://link
        			if ( ele.ele.tagName == "A" ) ele.detach();
            		to.append( make( instance.defaults.linkWrapTag ).addClass( ctxprop ).append( make( property ).attr( 'href', txt ).text( txt ) ) );
            		return;
            	}

            	if ( dateMask ) dateMask( new Date( txt ) || txt, ele.ele ); 
            	else if ( txtMask ) txtMask( txt, ele.ele );
            	else ele.text( txt );

	        },


	        /**
	         * Parse a string
	         * @param {String} property The property name to be parsed.
	         * @param {Object} ctx Template context.
	         * @param {jQuery} to Element to append to.
	         * @param {Object} dataCtx Data context.
	         * @param {Object} ele Current element to operate upon. 
	         */
	        parseString: function( property, ctx, to, dataCtx, ele, idx ) {
	        	// check data for ctx[ property ]
	        	var f = false,
	        		cprop = !isArray( ctx ) && ctx[ property ] || ( isArray( ctx ) ? ctx[ idx ] : '' ),
        			txt = !isArray( ctx ) && dataCtx[ cprop ] || ( isArray( ctx ) ? dataCtx[ ctx[ idx ] ] : '' ),
        			txt = !txt ? '' : txt,
					ismulti = isMultiClass( cprop ),
					isdate = isDateString( txt ); // is data node a date?

    			if ( ismulti && !f ) {
    				for ( var classes = cprop.split( ' ' ), nclass = classes.length, v = 0; v < nclass; v++) {
    					ele.addClass( classes[ v ] );
    					txt = dataCtx[ classes[ v ] ] || '';
    					isdate = isDateString( txt );

    					if ( isdate && !f ){
    						this.parseDate( txt, ele );
    						f = true;
    					}
    				}
    			}

    			if ( isdate && !f ) {
    				this.parseDate( txt, ele );
    				f = true;
    			}

    			ele.addClass( !f ? cprop : '' ).appendTo( to );

    			if ( txt == '' && instance.defaults.stripEmptyNodes && !f ) ele.detach();

    			this.parseText( txt, ele, to, property, cprop );
	        },


	        /**
	         * parse an HTML element
	         * @param {String} property The potential HTML element tag name.
	         * @param {Object} ctx Template context.
	         * @param {jQuery} to Element to append to. 
	         * @param {Object} dataCtx Context of the data.
	         * @returns {Boolean}
	         */
	        parseHTMLElements: function( property, ctx, to, dataCtx ){
	            var ele = null, key = ctx['key'], txt, type, n, str = omap.join(' '), cprop = ctx[ property ];

	            if ( n = ~str.indexOf( property.length > 3 ? property : property+' ' ) ) {

	            	if ( property == str.substr( -( n + 1 ), property.length ) ) {

	                	type = typeOf( cprop );
	                    ele = make( property );

	                    switch ( type ) {

		                    case "string":
		                        if ( !key ) {
		                        	this.parseString( property, ctx, to, dataCtx, ele );
		                        } else {
		                            if ( isArrayTag( property ) ) {
		                                var _arr = this.drillDown( key, dataCtx );
		                                this.processKey( _arr, make(property), to );
		                                this.look( cprop, _arr, to );
		                            }
		                        }
		                    	break;

		                    case "array":
		                        for (var _alen = cprop.length, x = 0; x < _alen; x++)
		                        	this.parseString( property, cprop, to, dataCtx, make( property ), x );
		                    	break;

		                    case "object":
		                        ele.appendTo( to );
		                        // worm through..
		                        if ( key ) {
		                            var arr = this.drillDown( key, dataCtx );
		                            this.processKey( arr, ele );
		                        }
		                        this.look( cprop, dataCtx, ele );
		                    	break;
	                    }
	                    return true;
	            	}
	            }

	            str = ele = undefined; // garbage

	            return false;
	        },


	        /**
	         * main script loop
	         * @param {Object} ctx Template context.
	         * @param {Object} dataCtx Data context.
	         * @param {Object} to Element being appended to.
	         */
	        look: function( ctx, dataCtx, to ) {

	            var props = Object.keys( ctx ), plen = props.length, ctype = typeOf( ctx );

	            switch ( ctype ) {

	            case "object":
	            	for( var i = 0; i < plen; i++ ){

	            		var ele = null, isHtml = false, key = ctx['key'], 
	            			p = props[i], type = typeOf( ctx[ p ] );

	            		if ( isArray( dataCtx ) && !isArray( ctx ) ) {
	            			var n = dataCtx.length;
	            			for ( var v = 0; v < n; v++ ) {
	            				ele = to.children('li').at( v );
	            				if ( ele ) this.look( ctx, dataCtx[ v ], ele );
	            			}
	            			break;

	            		} else if ( isArray( ctx ) ) {
	            			var clen = ctx.length;
	            			for ( var z = 0; z < clen; z++ ) this.look( ctx[ z ], dataCtx, to );
	            			break;
	            		}

	            		isHtml = this.parseHTMLElements( p, ctx, to, dataCtx );

	            		if ( isHtml || p == 'key' ) continue;

	            		// parse unknown nodes
	            		switch ( type ) {

	            		case "string":
	            			debugger;
	            			var txt = dataCtx[ ctx[ p ] ] ? dataCtx[ ctx[ p ] ] : '';
	            			// TODO: check data for ctx[p]
	            			to.addClass( ctx[ p ] );
	            			if ( !isHTMLLinkTag( txt ) && !isLink( txt ) ) {
	            				to.text( txt );
	            			} else if ( isLink( txt ) ) {
	            				to.append( make( instance.defaults.linkWrapTag ).addClass( ctx[ p ] ).append( make( p ).attr( 'href', txt ).text( txt ) ) );
	            			} else if ( isHTMLLinkTag( txt ) ) {
	            				to.html( txt );
	            			}
	            			break;

	            		case "object":
	            			var div = make( 'div' ), drilled = false;
	            			if ( key ) {
	            				var arr = this.drillDown( key, dataCtx );
	            				if ( isArray( arr ) ) {
	            					dataCtx = arr;
	            					div.detach();
	            					div = make( instance.defaults.useArrayTag );
	            					div.addClass( p )
	            						.appendTo( to );
	            					drilled = true;
	            				}
	            				this.processKey( arr, make('li'), div );
	            			}
	            			if ( !drilled ) div.addClass( p ).appendTo( to );
	            			this.look( ctx[ p ], dataCtx[ p ] || dataCtx, div );
	            			break;
	            		}
	            	} // end property loop
	            	break;

	            case "string":
//    	            		parseString( props[ ctx ], ctx, to, dataCtx, to );
	            	to.addClass( ctx );
	            	break;
	            }
	        },


	        /**
	         * Insert defaults into application
	         * @param {Object} opts default options to set in the application
	         * @returns {Inherited}
	         */
	        setup : function( opts ) {
				defaults = merge( opts, defaults );
				return that;
			},


	        /**
	         * 
	         * @returns {Global}
	         */
			init : function( /** HtmlElement|HtmlElement ID, json_data, template, options|callback */ ) {
				instance = _findInstance( arguments, _instances, defaults );
				if ( instance ) _init.call( that, instance );
				return that;
			}
		};

        this.instances = _instances;

		this.setup = sj.setup;

		this.init = sj.init;

}).call( styleJSON );