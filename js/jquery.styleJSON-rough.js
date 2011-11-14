/**
 * 
 * @preserve styleJSON
 * version ...?
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

(function( $ ) {

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

    $.styleJSON = function( /** json, options, callback */ ) {
    	return $.fn.styleJSON.apply( $( document.body ), arguments );
    };

//    $.styleJSON._instances = [];

	$.styleJSON.defaults = $.styleJSON._defaults = {

			// HTML tag to wrap around a link when a string containing
			// 'http://[...]' exists and is parsed into an anchor (<a>) element
			linkWrapTag : "div",

			// default array tag to use for arrays 
			useArrayTag : "ul",

			// JavaScript Date Format
			// http://blog.stevenlevithan.com/archives/date-time-format
			// use Date Format script for formatting dates
			useDateFormat: true,

			// flag to use ajax to load date.format.js
			// if false, will use <script /> tag
			useDateFormatAjaxLoad : false,

			// path to date.format.js
			dateFormatPath: "js/date.format.js",

			// user-defined function for custom date formatting
			fnFormatDate : jQuery.noop,

			// format for the dateFormat script
			dateFormat : "dddd, mmmm d, yyyy"
	};

    /**
     * @class jQuery.fn.styleJSON
     */
    $.fn.styleJSON = function( /** json, template, callback */ ){

    	/* utility functions */
        function make( tag, nojQ ){
            if ( !nojQ ) return $( document.createElement( tag ) );
            else return document.createElement( tag );
        }

    	function get( selector, nojQ ) {
    		if ( nojQ ) return document.getElementById( selector );
    		else return $( selector );
    	}

        function isArray( o ) {
        	return ( $.isArray( o ) );
        }

        function debug(msg){
    		if ( console && console.log ) console.log( msg );
        }

        /**
         * 'normalize' object types for use in script
         */
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

        function dressArrayData( arr ) {
        	return { items : arr };
        }

        function dressTemplate( o ) {
        	if ( o['key'] ) {
        		return o;
        	} else {
        		return { key: "items", items : o };
        	}
        }

        function handleIfArrayData( array, template ) {
    		if ( isArray( array ) ) {
    			return {
					data: dressArrayData( array ),
					template: dressTemplate( template )
    			};
    		} else {
    			return { data: array, template: template };
    		}
        }

        function callbacking(m, j){
            if ( cb ) {
            	if ( (len-1) == inc ) { // callback only once per operation
	            	inc = 0;
	            	cb.call(m, m, j);
	            }
            }
        	inc++;
        }
    	/* end utility functions */


        /**
         * @function
         * exploratory object extended to another object.
         */
        var Context = function( ) {
            var props = typeofContext( this );
            for ( var p in props ) {
                if ( !( p in this ) ) {
                    this[ p ] = props[ p ];
                }
            }
            return this;
        };

        function typeofContext( ctx ){
        	if ( 'hasKey' in ctx && 'types' in ctx ) return ctx;
            var o = {types:[], hasKey:false};

            for (var p in ctx) {
                if ( p == 'key' ) o.hasKey = true;
                o.types.push( typeof ctx[p] );
            }
            return o;
        }


        var args = Array.prototype.slice.call( arguments ),
            json = args[0],
            template = args[1],
            cb = typeOf( args[2] ) == 'function' ? args[2] : jQuery.noop,
            omap = 'div span h1 h2 h3 section ul ol li a p i b label'.split( ' ' ),
            arrayTags = 'ol ul'.split( ' ' ),
            isArrayTag = function( str ) {return /ul|ol|li/gi.test(str);},
            linkTag = 'a',
            isLink = function( str ) { return /http:/im.test(str); },
            isHTMLLinkTag = function( str ) {return /<a[^>]*>(.*?)<\/a>/gi.test(str);},
            isMultiClass = function( str ) { return str ? ( str.split( ' ' ).length > 1 ) : false; },
            data = null,
            inc = 0,
            me = this,
            len = this.length ? ( this.length ) : 0,
            isDateString = function( d ){ return /Date\(\d*\)/g.test( d ); },
            isDateFormatLoaded = function(){ try{ if ( typeOf( dateFormat ) == 'function' ) return true; else return false;}catch(e){return false;} },

    		sj = {
				_instance : [],

    	        /**
    	         * Attempt to "drill down" into a data source by the given key
    	         * @param {String} key String of names delimited by a period to 'drill-down' into a data source with.
    	         * @param {Object} obj The data source object to attempt drilling down into. 
    	         * @returns {?Object}
    	         */
				tryDrilldown: function( key, obj ) {
					var arr = key.split('.'),
    	                arrlen = arr.length,
    	                o = obj;

    	            for (var i = 0; i < arrlen; i++) {
    	                if ( o.hasOwnProperty( arr[i] ) ){
    	                    o = o[ arr[i] ];
    	                }
    	            }

    	            if ( o == obj ) return null;
    	            else return o;
    	        },


    	        /**
    	         * process keys
    	         */
    	        processKey : function( arr, ele, parent ){
    	        	var _parent =  parent ? parent : ele.parent(),
	        			len = parent ? (!arr ? 0 : arr.length) : arr.length-1;
        			for (x = 0; x < len; x++) {
        				var _to = make( ele[0].tagName.toLowerCase() );
        				_to.appendTo( _parent );
        			}
    	        },


    	        /**
    	         * Parse a JSON date string and add parsed text to given element
    	         * @param {String} txt Formatted Date string NOT in ISO8601
    	         * @param {jQuery} ele jQuery wrapped element to operate on.
    	         * @param {jQuery} to jQuery wrapped parent element to append ele to.
    	         */
    	        parseDate: function( txt, ele, to ){
    	        	try{
    	        		txt = Date.fromJSONDate( txt );
    	        		isDate = true;
    	        		if ( defs.useDateFormat && isDateFormatLoaded() ) {
    	        			txt = dateFormat( txt, defs.dateFormat );
    	        			ele.text( txt );
    	        		} else if ( defs.useDateFormatAjaxLoad ) {
    	        			$.getScript( defs.dateFormatPath, function(d){
    	        				txt = dateFormat( txt, defs.dateFormat );
    	        				ele.text( txt );
    	        			});
    	        		} else {
    	        			// lazy-load date.format.js
    	        			(function(d, n, t, e){
    	        				var s = make( n, true ),
    	        					h = document.getElementsByTagName( n )[0];

    	        				s.async = s.src = defs.dateFormatPath;

    	        				// using jQuery's onload/onreadystatechange fix
    	        				s.onload = s.onreadystatechange = function( ) {

    	        					if ( !s.readyState || /loaded|complete/.test( s.readyState ) ) {

    	    	        				if ( defs.fnFormatDate != jQuery.noop ) defs.fnFormatDate( t, e, defs.dateFormat );
    	    	        				else {
    	    	        					t = dateFormat( t, defs.dateFormat );
    	    	        					e.text( t );
    	    	        				}

    	        						// Handle memory leak in IE
    	        						s.onload = s.onreadystatechange = null;

    	        						// Remove the script
    	        						if ( s.parentNode ) {
    	        							s.parentNode.removeChild( s );
    	        						}

    	        						// Dereference the script and references
    	        						s = e = t = undefined;
    	        					}
    	        				};

    	        				h.parentNode.insertBefore( s, h );
	        				})(document,'script', txt, ele);
    	        		}

    	        		if ( to ) to.append( ele );

    	        	} catch(e){
    	        		debug('error parsing Date string.');
    	        	}
    	        },


    	        /**
    	         * Parse a string
    	         * @param {String} property The property name to be parsed.
    	         * @param {Object} ctx Template context.
    	         * @param {jQuery} to Element to append to.
    	         * @param {Object} dataCtx Data context.
    	         * @param {Object} ele Current element to operate upon. 
    	         */
    	        parseString: function( property, ctx, to, dataCtx, ele ) {
    	        	// check data for ctx[ property ]
    	        	var formatted = false,
    	        		cprop = ctx[ property ] || '',
	        			txt = dataCtx[ cprop ] || '',
    					ismulti = isMultiClass( cprop ),
    					isdate = isDateString( txt ); // is data node a date?

        			if ( ismulti ) {
        				var classes = cprop.split(' '), nclass = classes.length;
        				for ( var v = 0; v < nclass; v++) {
        					ele.addClass( classes[ v ] );
        					txt = dataCtx[ classes[ v ] ] || '';
        					isdate = isDateString( txt );

        					if ( isdate && !formatted ){
        						this.parseDate( txt, ele, to );
        						formatted = true;
        					}
        				}
//    	            	ele.appendTo( to );
        			} else if ( isdate ) {
        				this.parseDate( txt, ele, to );
        				formatted = true;
        			} else {
        				ele.addClass( cprop ).appendTo( to );
        			}

    	            // check if it is a link
    	            if ( !formatted ) {
    	            	if ( !isHTMLLinkTag( txt ) && !isLink( txt ) ) {
    	            		ele.text( txt );
    	            	} else if ( isLink( txt ) ) {
                			if ( ele[0].tagName == "A" ) ele.detach();
    	            		to.append( make( linkWrapTag ).addClass( cprop ).append( make( property ).attr( 'href', txt ).text( txt ) ) );
    	            	} else if ( isHTMLLinkTag( txt ) ){ 
    	            		ele.html( txt );
    	            	}
    	            }
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
    	        	if ( property == "key" ) return false;
    	            var m = omap, ele = null, key = ctx['key'], txt, type;
    	            for (var i = 0; i < m.length; i++) {

    	                // node matches html element
    	                if ( property == m[i]){
    	                	type = typeOf( ctx[ property ] );
    	                    ele = make( property );

    	                    switch ( type ) {

    		                    case "string":
    		                        if ( !ctx.hasKey ) {
    		                        	this.parseString( property, ctx, to, dataCtx, ele );
    		                        } else {
    		                            if ( isArrayTag( property ) ) {
    		                                var _arr = this.tryDrilldown( key, dataCtx );
    		                                this.processKey( _arr, make(property), to );
    		                                this.look( ctx[ property ], _arr, to );
    		                            }
    		                        }
    		                    	break;

    		                    case "array":
    		                        var _a = ctx[ property ], _alen = _a.length;
    		                        for (var x = 0; x < _alen; x++) {

    		                        	// is multiclass?
    		                            if ( isMultiClass( _a[ x ] ) ) {
    		                            	var classes = _a[ x ].split(' '), nclass = classes.length;
    		                            	for ( var v = 0; v < nclass; v++) {
    		                            		ele.addClass( classes[ v ] );
    		                            		txt = dataCtx[ classes[ v ] ] ? dataCtx[ classes[ v ] ] : ''; 
    		                                    if ( isDateString( txt ) ){
    		                                    	this.parseDate( txt, ele );
    		                                    } else {
    		                                    	if ( ele.text() == "" ) ele.text( txt );	// do not over-write parsed date value if exists
    		                                    }
    		                            	}
    		                            	ele.appendTo( to );
    		                            } else {
    		                            	txt = dataCtx[ _a[x] ] ? dataCtx[ _a[x] ] :
    		                            		( dataCtx[ key ] && dataCtx[ key ][ _a[x] ] ? dataCtx[ key ][ _a[x] ] : '' );

    		                            	var _o = make( property );
    		                            	_o.addClass( _a[x] ).appendTo( to );

    		                            	if ( isDateString( txt ) ){
    		                            		this.parseDate( txt, _o, to );
    		                            	} else {
    		                            		if ( !isHTMLLinkTag( txt ) && property != linkTag ) {
    		                            			_o.text( txt );
    		                            		} else if (  property == linkTag  ) {
    		                            			if ( _o[0].tagName == "A" ) _o.detach();
    		                            			to.append( make( linkWrapTag ).addClass( _a[x] ).append( make( property ).attr( 'href', txt ).text( txt ) ) );
    		                            		} else {
    		                            			_o.html( txt );
    		                            		}
    		                                }
    		                            }
    		                        }
    		                    	break;

    		                    case "object":
    		                        ele.appendTo( to );
    		                        // worm through..
    		                        if ( ctx.hasKey ) {
    		                            var arr = this.tryDrilldown( key, dataCtx );
    		                            this.processKey( arr, ele );
    		                        }
    		                        this.look( ctx[ property ], dataCtx, ele );
    		                    	break;
    	                    }

    	                    return true;
    	                } else continue;
    	            }   // end loop
    	            return false;
    	        },


    	        /**
    	         * main script loop
    	         * @param {Object} ctx Template context.
    	         * @param {Object} dataCtx Data context.
    	         * @param {Object} to Element being appended to.
    	         */
    	        look: function( ctx, dataCtx, to ) {

    	            Context.call( ctx );
    	            var props = Object.keys( ctx ), ctype = typeOf( ctx );

    	            switch ( ctype ) {

    	            case "object":
    	            	for( var i = 0; i < props.length; i++ ){
    	            		if ( props[i] == 'types' || props[i] == 'hasKey' ) continue;

    	            		var ele = null, isHtml = false, key = ctx['key'], 
    	            			p = props[i], type = typeOf( ctx[ p ] );

    	            		if ( isArray( dataCtx ) && !isArray( ctx ) ) {
    	            			var n = dataCtx.length;
    	            			for ( var v = 0; v < n; v++ ) {
    	            				ele = to.children('li').eq( v );
    	            				if ( !ele.length ) {
    	            					if ( isArrayTag( p ) ) { /* rare */ }
    	            				} else {
    	            					this.look( ctx, dataCtx[ v ], ele );
    	            				}
    	            			}
    	            			break;
    	            		} else if ( isArray( ctx ) ) {
    	            			var clen = ctx.length;
    	            			for ( var z = 0; z < clen; z++ ) {
    	            				this.look( ctx[ z ], dataCtx, to );
    	            			}
    	            			break;
    	            		}

    	            		isHtml = this.parseHTMLElements( p, ctx, to, dataCtx );

    	            		if ( isHtml || p == 'key' ) continue;

    	            		// parse unknown nodes
    	            		switch ( type ) {

    	            		case "string":
    	            			var txt = dataCtx[ ctx[ p ] ] ? dataCtx[ ctx[ p ] ] : '';
    	            			// TODO: check data for ctx[p]
    	            			to.addClass( ctx[ p ] );
    	            			if ( !isHTMLLinkTag( txt ) && !isLink( txt ) ) {
    	            				to.text( txt );
    	            			} else if ( isLink( txt ) ) {
    	            				to.append( make( linkWrapTag ).addClass( ctx[ p ] ).append( make( p ).attr( 'href', txt ).text( txt ) ) );
    	            			} else if ( isHTMLLinkTag( txt ) ) {
    	            				to.html( txt );
    	            			}
    	            			break;

    	            		case "object":
    	            			var div = make( 'div' ), drilled = false;
    	            			if ( ctx.hasKey ) {
    	            				var arr = this.tryDrilldown( key, dataCtx );
    	            				if ( isArray( arr ) ) {
    	            					dataCtx = arr;
    	            					div.remove();
    	            					div = make( defs.useArrayTag );
    	            					div.addClass( p )
    	            						.appendTo( to );
    	            					drilled = true;
    	            				}
    	            				this.processKey( arr, make('li'), div );
    	            			}
    	            			if ( !drilled ) div.addClass( p ).appendTo( to );
    	            			this.look( ctx[ p ], dataCtx, div );
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
    	         * main entry point
    	         * @param {Object} data JSON data source
    	         * @param {Object} template Style-directive object
    	         * @param {Object} matched Matched jQuery element
    	         */
    	        init : function( data, template, $matched ) {
//    	        	$.styleJSON._instances.push( { template:template, data:data, matched:$matched } );
    	        	$matched.data( 'data', data );
    	        	var _o = handleIfArrayData( data, template );
    	        	this.look( _o.template, _o.data, $matched );
    	        	callbacking( me, json);
    	        }
			},
			defs = sj.defaults = $.extend( $.styleJSON._defaults, ( $.styleJSON.defaults || {} ) ),
			linkWrapTag = defs.linkWrapTag;

		return this.each(function(){

			var $this =  $(this);
			data = $this.data('data') ? $this.data('data') : data;

			switch ( typeOf( json ) ){
			case "string":
				if ( data == null ) {
					$.getJSON( json, function(_d){
						data = json = _d;
						sj.init.call( sj, data, template, $this );
					})
					.error(function(e){
						if ( e.responseText ) {
							json =  data = eval( '('+e.responseText+')' );
							if ( typeOf( json ) == 'object' ) sj.init.call( sj, data, template, $this );
						} else {
							debug( 'An error occured.' );
						}
					});
				} else {
					sj.init.call( sj, data, template, $this );
				}
				break;

			case "array":
			case "object":
				sj.init.call( sj, data = json, template, $this );
				break;
			}
		});
            };

})( window.jQuery, undefined );