/**
 * 
 * @preserve styleJSON
 * version 2.0-standalone
 * 
 * Copyright (c) 2011 Daniel Brooks
 * The MIT License (MIT)

 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*jslint onevar: true */

var styleJSON = {};
(function( doc ){

	'use strict';

	// add Object.keys if doesn't exist
	if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o))
            throw new TypeError('Object.keys called on non-object');
        var ret=[],p;
        for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
        return ret;
    };

    Object.isEmpty = function(o){ var i = 0,p; for ( p in o ) if ( o.hasOwnProperty( p ) ) i++; return i === 0; };

	// http://ejohn.org/files/pretty.js
	Date.parseISO8601 = function(str){ return new Date( str.replace(/-/g,"/").replace(/[TZ]/g," ") ); };

    Date.fromDotNetJSONDate = function( jsonDate ){ return eval( jsonDate.replace( /\/Date\((-?\d+)\)\//gi, "new Date($1)" ) ); };

	this.Context = function( ele ) {

		var ele = typeOf( ele ) === 'object' ? ele : ( typeof ele === 'string' ? doc.getElementById( ele ) : null );
		if ( null == ele ) return debug( errormsg.sjCtx, new TypeError( errormsg.sjCtx ) );

		function Context( e ) { this.ele = e.ele; this.id = getTime(); } 

		Context.prototype = (function( el ){

			var _ctx = el, // element context
				_children = [];

			return {
				setCtx :function(c) { _ctx = this.ele = c; },
				getCtx :function() { return _ctx; },

				getId :function(){ return this.id; },

				// can get an element by id or get and change context to the found element.
				get :function( a, switchCtx ){
					var o = doc.getElementById( a ) || null;
					if ( !switchCtx ) return o;
					else this.setCtx( o );

					return this;
				},

				make :function( a ){
					return doc.createElement( a );
				},

				children :function( a, switchCtx ) {
					if ( !a ) return _ctx.children;
					_children = [];
					for ( var l = _ctx.children.length, nodes = _ctx.children, x = 0; x < l; x++) {
						if ( a === nodes[ x ].tagName.toLowerCase() )
							_children[_children.length] = nodes[ x ];
					}

					return this;
				},

				// returns element at the index
				at :function( i ) {
					return isArray( _children ) ? ( _children.length > 0 ? styleJSON.Context( _children[ i ] ) : null ) : null;
				},

				detach :function() {
					var p = _ctx.parentNode, n;
					if ( p ) n = p.removeChild( _ctx );
					if ( n ) _ctx = n;

					return this;
				},

				// append an element or append and change context to that element.
				append :function( y, switchCtx ) {
					if ( typeof y === 'object' ) y = _ctx.appendChild( y.ele || y );
					else if ( typeof y === 'string' ) y = _ctx.appendChild( this.make( y ) );

					this.setCtx( switchCtx ? ( y.ele || y ) : _ctx );

					return this;
				},

				// append to an element or append to and change context to the target element.
				appendTo :function( y, switchCtx ) {
					var x = y;
					if ( typeof y === 'object' ) y.ele ? y.ele.appendChild( _ctx ) : y.appendChild( _ctx );
					else if ( typeof y === 'string' ) this.get( y ).appendChild( _ctx );

					this.setCtx( switchCtx ? ( x.ele || x ) : _ctx );

					return this;
				},

				text :function( a ){ if ( !a ) return _ctx.innerText; else _ctx.innerText = a; return this; },

				html :function( a ) { if ( !a) return _ctx.innerHTML; else _ctx.innerHTML = a; return this; },

				removeClass :function( a ){
					if ( !a ) {
						_ctx.className = '';
						return this;
					}
					if ( a !== '' ) {
						var cl = _ctx.className, cns = cl !== '' ? cl.split(' ') : [], n = cns.length;
						while(n--){
							if ( cns[n] === a ) cns[n] = '';
						}
						_ctx.className = cns.join(' ');
					}
					return this;
				},

				addClass :function( c ) {
					if ( c !== '' ) {
						var cn = _ctx.className, cns = cn !== '' ? cn.split(' ') : [], l = cns.length;
						if ( l > 0 ){
							cns[ l ] = c;
							cn = cns.join(' ');
						} else cn += (cn !== '' ? ' ' : '') + c;
						_ctx.className = cn;
					}

					return this;
				},

				attr :function( attr, val ){
					if ( val ) _ctx.setAttribute( attr, val );
					else return _ctx.getAttribute( attr ) || null;
	 
					return this;
				}
			};
		}).call(Context, ele);

		function init( ){
			var c = new Context( this );
			return c;
		}

		return init.call( { ele: ele || null } );
	};

	var that = this, instance = null, _idef /* instance.defaults */, _instances = [], args = [], timeout,
		errormsg = { sjCtx : 'styleJSON.Context passed non-object and/or non-string.', xhr : 'XHR request failed.', parse : { date: 'Date string parse error.', isodate : 'ISO8601 Date parse failed.' } },
		getMaxNum = function() { return _idef && _idef.maxnum ? _idef.maxnum : Number.MAX_VALUE; },
		omap = 'section legend span div em h1 h2 h3 p pre i b q s sub sup ul ol li a abbr cite code footer header strong small label address article blockquote fieldset'.split( ' ' ),
		hasOwn = !!Object.prototype.hasOwnProperty,
		isArray = function( o ) { if ( o && o.length >= 0 ) return true; else return false; },
		isArrayTag = function( str ) {return (/ul|ol|li/gi).test(str);},
		isLink = function( str ) { return (/http:/im).test(str); },
		isHTMLTag = function( str ){ return (/<\/?[a-z][a-z0-9]*[^<>]*>/gi).test( str ); },
		isMultiClass = function( str ) { return str ? ( str.split( ' ' ).length > 1 ) : false; },
		isdotNetDateString = function( d ){ return (/Date\(\d*\)/g).test( d ); },
		isISOStr = function( str ) { return (/([0-9]{4})-(1[0-2]|0[1-9])-?(3[0-1]|0[1-9]|[1-2][0-9])T/g).test( str ); },
		isXHRError = function( code ) { return (/[45][01][0-9]/g).test( code ); },
		isXHRSuccess = function( code ) { return (/[23][0][0-7]/g).test( code ); },
		isDateFormatLoaded = function(){ try{ if ( typeOf( dateFormat ) === 'function' ) return true; else return false;}catch(e){return false;} },
		make = function( ele ) { return styleJSON.Context( doc.createElement( ele ) ); },
		defaults = {

			// enable debugging console messages
			isDebug : true,

			// max number of list elements to parse & display
			// default is null.  when null, display all nodes
			maxnum : null,

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
			dateFormatPath: "lib/date.format.js",

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

				// target a node to add one of the events to it
				events : {
					/** 
					 * possible node events
					 * ex: node_one: {
					 *		mousedown: function(){}
					 * }
					 * mousedown, mouseup, click, dblclick, mouseover, mouseout 
					 */
				},

				// target a specific text node
				special: {
					/**
					 * ex: my_node : '<span>%0</span>'
					 *	OR
					 * ex: my_node : function(text, sJelement, element){
					 *		// do your own parsing, add text/html to the element passed
					 * }
					 */
				}
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
    			var req, urlstr = ( url.indexOf( '?' ) > -1 ? '&' : '?' ) +'_='+ getTime(), 
    				_url = url + urlstr, _fn = fn || function(){},
    				trgt, ies = 'Microsoft.XMLHTTP MSXML2.XMLHTTP MSXML2.XMLHTTP.5.0 MSXML2.XMLHTTP.4.0 MSXML2.XMLHTTP.3.0',
    				ie, len, success = false, i;
				type = !type ? 'json' : type;

    			try {
    				req = new XMLHttpRequest();
    	        } catch ( e1 ) {
    	        	try {
    	        		req = new ActiveXObject("Msxml2.XMLHTTP");
    	        	} catch( e2 ) {
    	        		for ( ie = ies.split(' '),
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
    	        	trgt = a.currentTarget;
    	        	if ( trgt.readyState === 4 ) {
    	        		if ( isXHRSuccess( trgt.status ) ) {
    	        			var t = trgt.responseText, data;

	    	        		if ( type === 'json' ) {
	        	        		if ( JSON && JSON.parse ) data = JSON.parse( t );
	        	        		else data = eval('(' + t + ')');
	    	        		}

	    	        		_fn.call( this, data, t, a );

	    	        		req = data = a = t = undefined;
    	        		} else if ( isXHRError( trgt.status ) ) trgt.onerror( a );
    	        	}
    	        };

    	        req.onerror = function(e){ debug( errormsg.xhr, new XHRError( e.currentTarget.status + ' ' + e.currentTarget.statusText ) ); };
    	        req.onreadystatechange = complete;

    	        try {
    	        	req.open( 'GET', _url, true );
        	        if ( typeof req.setRequestHeader !== "undefined" ){ // Opera can't setRequestHeader()
                        if ( typeof req.overrideMimeType === "function" ) {
                        	req.overrideMimeType('application/json');
                        }
                        req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                    }
        	        req.send( _url );
                } catch (e) {
                	debug(errormsg.xhr, e); 
                }
    		},


    		/**
	         * Attempt to "drill down" into a data source by the given key
	         * @param {String} key String of names delimited by a period to 'drill-down' into a data source with.
	         * @param {Object} obj The data source object to attempt drilling down into. 
	         * @returns {?Object}
	         */
			drillDown: function( key, obj ) {
				var arr = key.split('.'), arrlen = arr.length, o = obj, i;

	            for ( i = 0; i < arrlen; i++) {
	                if ( o[ arr[i] ] && o[ arr[i] ] !== 'undefined' ){
	                    o = o[ arr[i] ];
	                } else if ( i === (arrlen-1) && o[ arr[ i ] ] == null ) o = null;
	            }

	            return o;
	        },


	        /**
	         * process keys
	         */
	        processKey : function( arr, ele, parent ){
    			for ( var n = getMaxNum(), _parent =  parent ? parent : ele, len = ( arr && isArray( arr ) ) ? (arr.length > n ? n : arr.length) : 0, x = 0; x < len; x++ ) {
    				make( ele.ele.tagName.toLowerCase() ).appendTo( _parent );
    			}
	        },


	        /**
	         * *
	         * Parse a JSON date string and add parsed text to given element
	         * @param {String} txt Formatted Date string NOT in ISO8601
	         * @param {jQuery} ele jQuery wrapped element to operate on.
	         * @param {String} type type of Date returned from isDateString().type
	         */
	        parseDate: function( txt, ele, type ){
	        	var d = _idef, _date;
	        	try{
	        		switch ( type ){
	        		case '.net':
		        		txt = Date.fromDotNetJSONDate( txt );
	        			break;
	        		case 'iso':
	        			_date = Date.parseISO8601( txt );
	        			if ( _date.getDate ) txt = _date;
	        			break;
	        		}

	        		if ( d.useDateFormat && isDateFormatLoaded() ) formatDate( txt, ele, d.dateFormat );
	        		else lazyload( 'script', txt, ele, d.dateFormatPath, 'dateFormat' ); // lazy-load the date format script
	        	} catch( e ){
	        		debug( errormsg.parse.date, e );
	        	}
	        },


	        /**
	         * 
	         * @param events
	         * @param ele
	         */
	        setEvent: function( events, ele ){
	        	for( var p in events ) {
	        		if ( hasOwn && events.hasOwnProperty( p ) ) addEvent( ele.ele, p, events[ p ] || function(){} );
	        	}
	        },


	        /**
	         * 
	         * @param txt
	         * @param ele
	         * @param to
	         * @param property
	         * @param masks
	         */
	        parseText : function( txt, ele, to, property, masks ) {
	        	if ( txt === '' ) return;

	        	var f = false, x, d = _idef, o = isDateString( txt );

	        	if ( !Object.isEmpty(masks.events) ) {
	        		this.setEvent( masks.events, ele );
	        	}

            	if ( isHTMLTag( txt ) ) {	// <a></a>
            		ele.html( txt );
            		f = true;
        		}

            	if ( isLink( txt ) && !f ) { // http://link
            		if ( txt.indexOf( 'http://' ) > -1 ) {
            			txt = txt.replace( /((http|https):\/\/[a-zA-Z0-9\S]*)/g, "<a target=\"_blank\" href=\"$1\">$1</a>");
            			ele.html( txt );
            		}
            		f = true;
            	}


            	if ( masks.date ) {
            		masks.date( txt, ele.ele ); 
            	} else if ( o.isdate && !f ) {
    				this.parseDate( txt, ele, o.type );
    				f = true;
            	} else if ( masks.special ) {
            		if ( typeof masks.special === 'function' ) masks.special( txt, ele, ele.ele );
            		else if ( typeof masks.special === 'string' ) {
            			if ( txt = masks.special.replace( (/%+\d{1}/gi), txt ) ) {
            				this.parseText( txt, ele, to, property, {} );
            			}
            		}
            	}
            	else if ( !f && !o.isdate ) ele.text( txt );
	        },


	        /**
	         * Parse a string
	         * @param {String} property The property name to be parsed.
	         * @param {Object} ctx Template context.
	         * @param {jQuery} to Element to append to.
	         * @param {Object} dataCtx Data context.
	         * @param {Object} ele Current element to operate upon. 
	         * @param {Integer} idx 
	         */
	        parseString: function( property, ctx, to, dataCtx, ele, idx ) {
	        	// check data for ctx[ property ]
	        	var f = false, d = _idef, classes, nclass, v,
					cprop = !isArray( ctx ) && ctx[ property ] || ( isArray( ctx ) ? ctx[ idx ] : '' ),
					txt = ( !isArray( ctx ) && dataCtx[ cprop ] || ( isArray( ctx ) ? dataCtx[ ctx[ idx ] ] : '' ) ) || '' ,
					ismulti = isMultiClass( cprop ),
					masks = { date: searchObj( cprop, d.masks.date ), events:searchObj( cprop, d.masks.events ), special:searchObj( cprop, d.masks.special ) }; 

    			if ( ismulti && !f ) {
    				for ( classes = cprop.split( ' ' ), nclass = classes.length, v = 0; v < nclass; v++)
    					this.parseString( property, classes, to, dataCtx, ele, v );
					return;
    			}

    			ele.addClass( !f ? cprop : '' ).appendTo( to );

    			if ( txt === '' && _idef.stripEmptyNodes && !f && !isArray( ctx ) ) ele.detach();

    			this.parseText( txt, ele, to, property, masks );
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
	            var ele = null, key = ctx.key, type, n, alen, arr, x, str = omap.join(' '), cprop = ctx[ property ];

	            if ( n = ~str.indexOf( property.length > 3 ? property : property+' ' ) ) {

	            	if ( property === str.substr( -( n + 1 ), property.length ) ) {

	                	type = typeOf( cprop );
	                    ele = make( property );

	                    switch ( type ) {

		                    case "string":
		                        if ( !key || dataCtx[ cprop ] ) { // 12.13.2011 bug with node not being parsed cuz it had key
		                        	this.parseString( property, ctx, to, dataCtx, ele );
		                        } else {
		                            if ( isArrayTag( property ) ) {
		                                arr = this.drillDown( key, dataCtx );
		                                this.processKey( arr, make(property), to );
		                                this.look( cprop, arr, to );
		                            }
		                        }
		                    	break;

		                    case "array":
		                        for (alen = cprop.length, x = 0; x < alen; x++)
		                        	this.parseString( property, cprop, to, dataCtx, make( property ), x );
		                    	break;

		                    case "object":
		                        ele.appendTo( to );
		                        // worm through..
		                        if ( key ) {
		                            arr = this.drillDown( key, dataCtx );
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

	            var props = Object.keys( ctx ), plen = props.length, ctype = typeOf( ctx ), d = _idef,
	            	n, v, z, i, clen, div, drilled = false, arr;

	            switch ( ctype ) {

	            case "object":
	            	for( i = 0; i < plen; i++ ){

	            		var ele = null, isHtml = false, key = ctx.key, 
	            			p = props[i], type = typeOf( ctx[ p ] );

	            		if ( isArray( dataCtx ) && !isArray( ctx ) ) {
	            			n = dataCtx.length > getMaxNum() ? getMaxNum() : dataCtx.length; // enforce max number of elements
	            			for ( v = 0; v < n; v++ ) {
	            				ele = to.children('li').at( v );
	            				if ( ele ) this.look( ctx, dataCtx[ v ], ele );
	            			}
	            			break;

	            		} else if ( isArray( ctx ) ) {
	            			clen = ctx.length;
	            			for ( z = 0; z < clen; z++ ) this.look( ctx[ z ], dataCtx, to );
	            			break;
	            		}

	            		isHtml = this.parseHTMLElements( p, ctx, to, dataCtx );

	            		if ( isHtml || p === 'key' ) continue;

	            		/* parse unknown nodes */
	            		switch ( type ) {

	            		case "string": /* unimplemented because use-case is discouraged */ break;

	            		case "object":
	            			div = make( 'div' );
	            			if ( key ) {
	            				arr = this.drillDown( key, dataCtx );
	            				if ( isArray( arr ) ) {
	            					dataCtx = arr;
	            					div = make( d.useArrayTag ).addClass( p ).appendTo( to );
	            					drilled = true;
	            				}
	            				if ( arr ) this.processKey( arr, make('li'), div );
	            			}
	            			if ( !drilled ) div.addClass( p ).appendTo( to );
            				this.look( ( typeOf( dataCtx[p] ) != 'null' ? ctx[ p ] : {} ), dataCtx[p] || dataCtx, div );
	            			break;
	            		}
	            	} // end property loop
	            	break;

	            case "string":
//    	            parseString( props[ ctx ], ctx, to, dataCtx, to );
	            	to.addClass( ctx );
	            	break;
	            }
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

	this.isDebug = defaults.isDebug;

    this.instances = _instances;

	this.lazyloads = {};

	this.activeLazy = [];

	this.addEvent = addEvent;

	this.init = sj.init;


	function typeOf( o ) {
    	if ( typeof o === 'undefined' ) return 'undefined';
    	if ( o == null ) return 'null'; // "fix" javascript's typeof null === 'object' gotcha
    	var type = typeof o;

    	if ( type === 'object' ){
    		return ( isArray( o ) ? 'array' : 'object' );
    	} else return type;
	}

    function dressArrayData( arr ) { return { items : arr }; }

    function dressTemplate( o ) { if ( o.key ) return o; else return { key: "items", items : o }; }

    function debug( msg, ex ){
    	if ( _idef ) {
    		if ( _idef.isDebug && console && console.error && console.warn ) {
	    		console.error(msg);
	    		console.error(ex);
	    		console.error(ex.stack);
	    	} else if ( _idef.isDebug && window.opera && opera.postError ) {
	    		opera.postError(msg, ex);
	    	}
    	}
    }

    function preprocess( array, template ) {
		if ( isArray( array ) ) {
			return {
				data: dressArrayData( array ),
				template: dressTemplate( template )
			};
		} else return { data: array, template: template };
    }

	function formatDate( date, el, ddf ) {
		if ( _idef.fnFormatDate ) _idef.fnFormatDate( date, el, ddf );
		else {
			el.text( dateFormat( date, ddf ) );
		}
	}

	function merge( a, b ){
		for ( var p in a ) {
			if ( a.hasOwnProperty( p ) ) {
				b[p] = ( typeOf( a[p] ) === 'object' ? merge( a[p], b[p] || {} ) : a[p] );
			}
		}
		return b;
	}

    function getTime() { return new Date().getTime(); }

    function inArray( elem, array ) {
    	if ( array.indexOf ) return array.indexOf( elem );
    	for ( var i = 0, len = array.length; i < len; i++ ) if ( array[ i ] == elem ) return i;
    	return -1;
    }

    function removeActiveLazy( script ){
    	var n;
		if ( ~( n = inArray( script, styleJSON.activeLazy ) ) ) styleJSON.activeLazy.splice( n, 1 );
    }

    function lazyload( type, txt, ele, src, name ) {
		var s = make( type ).ele, h = doc.getElementsByTagName( type )[0], llname = name || src, d = _idef;

		if ( styleJSON.lazyloads[ llname ] ) {
			styleJSON.lazyloads[ llname ].push( { txt:txt, ele:ele, format:d.dateFormat } );
			return;
		}

		if ( !styleJSON.lazyloads[ llname ] ) styleJSON.lazyloads[ llname ] = [];

		s.async = s.src = src; // 'truthy' async value = true

		// using jQuery's onload/onreadystatechange fix
		s.onload = s.onreadystatechange = function( ) {

			if ( !s.readyState || /loaded|complete/.test( s.readyState ) ) {

				// use custom function
				formatDate( txt, ele, d.dateFormat );

				if ( styleJSON.lazyloads[ llname ] ) {
					for( var ll = styleJSON.lazyloads[ llname ], len = ll.length, i=0; i< len; i++ )
						formatDate( ll[i].txt, ll[i].ele, ll[i].format );
				}

				// Handle memory leak in IE
				s.onload = s.onreadystatechange = null;

				removeActiveLazy( s );

				if ( s.parentNode ) s.parentNode.removeChild( s );

				// Dereference the script and references
				s = ele = txt = undefined;
			}
		};

		s.onerror = function(){
			removeActiveLazy( s );
		};

		styleJSON.activeLazy.push( s );

		h.parentNode.insertBefore( s, h );
    }

	function _findInstance( _arguments  /** HtmlElement|HtmlElement ID, json_data, template, options|callback */, _allinst, _defaults ) {
		args = [].slice.call( _arguments );

		// get selected element
		var ilen, b = doc.body,
			m = typeOf( args[0] ) === 'string' ? doc.getElementById( args[0] ) || b : 
				( typeOf( args[0] ) === 'object' ? args[0].ele || args[0] : b ),
			id = parseInt( m.getAttribute('sj-id') || getTime(), 10 ), 
			defs = ( defaults = typeOf( args[3] ) === 'function' ? merge( { completed: args[3] }, _defaults ) :
				( typeOf( args[3] ) === 'object' ? merge( args[3], _defaults ) :  _defaults ) );

		if ( ~(_allinst.length-1) ) {
        	ilen = _allinst.length;
        	while (ilen--) {
        		if ( _allinst[ ilen ].instanceid === id ) {
        			defaults = _idef = _allinst[ ilen ].defaults; // set defaults to current instance
        			return _allinst[ ilen ];
        		}
        	}
    	}

		return _makeInstance( args[1], args[2], m, id, defs, _allinst );
	}

	function _makeInstance( data, template, matched, id, _defaults, _allinstances ) {

		if ( typeOf( data ) === 'string' ) {

			sj.xhr.call( sj, data, function(a,b,c){
				instance = _makeInstance( a, template, matched, id, _defaults, _allinstances );
				_init.call( that, instance );
			});
			return;
		}

		var _inst, o = preprocess( data, template );

		_allinstances.push( _inst = { data: o.data, template: o.template, callback: _defaults.completed, matched: ( matched.ele ? matched : styleJSON.Context( matched ) ), instanceid: id, defaults : _defaults } );

		_inst.matched.attr( 'sj-id', id ); // assign element id
		_instances = _allinstances; // assign global
		o = matched = _defaults = _allinstances = undefined; // garbage collect

		_idef = _inst.defaults;
		return _inst;
	}

    function reset(){
    	defaults = merge( _defsbak, {} );
    	instance = null;
    }

    function addEvent( el, event, fn ) {

    	if ( !el.trackedEvents ) el.trackedEvents = {};

    	if ( !el.trackedEvents[ 'on'+event ] ) {
    		el.trackedEvents[ 'on'+event ] = [];

    	    el[ 'on'+event ] = function () {
    	    	for ( var i = 0, len = el.trackedEvents[ 'on'+event ].length; i < len; i++) {
    	    		el.trackedEvents['on'+ event ][ i ]();
    	    	}
    	    };
    	}
  	  	fn.$id = addEvent.$$id++;

  	  	el.trackedEvents[ 'on'+event ].push( fn );
    }
    addEvent.$$id = 0;

	function searchObj( ctxprop, mask ){
		if ( typeOf( mask ) === 'object' ) { for( var p in mask ) if ( p === ctxprop ) return mask[p]; }
		return false;
	}

    function isDateString( str ) {
    	var isdate = false, type = 'none';
    	if ( isdotNetDateString( str ) )  { 
    		isdate = true; 
    		type = '.net';
    	} else if ( isISOStr( str ) )  {
    		isdate = true;
    		type = 'iso';
    	}
    	return {isdate: isdate, type: type };
    }

    function wait( ms, fn, oncomplete ) {
		if (fn.timeout) clearTimeout(fn.timeout);
		fn.timeout = setTimeout(function(){ if ( !fn() ) wait( ms, fn, oncomplete ); else oncomplete(); }, ms);
    }

    function _init( inst /** instance */ ){
    	var m = inst.matched, d = inst.data, t = inst.template;
    	if ( inst.defaults.before ) inst.defaults.before.call( this, d, t, m );
		sj.look.call( sj, t, d, m );

		if ( this.activeLazy.length === 0 ){
			if ( inst.callback ) inst.callback.call( this, d, t, m );
		} else if ( inst.callback ) {
			wait( 50, function(){
				return !that.activeLazy.length > 0;
			}, function(){
				inst.callback.call( that, d, t, m );
			});
		}
		reset();
    }
	/* end utility functions */

	function XHRError(message) { this.name = "XHRError"; this.message = message || "XHR Failed"; }
	XHRError.prototype = new Error();
	XHRError.prototype.constructor = XHRError;


}).call( styleJSON, document );