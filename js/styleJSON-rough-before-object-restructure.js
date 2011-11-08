/*
 * The MIT License (MIT)
 * Copyright (c) 2011 Daniel Brooks

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

/**
 * styleJSON
 * @version 1.2 
 */

(function( $ ) {

    if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o))
            throw new TypeError('Object.keys called on non-object');
        var ret=[],p;
        for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
        return ret;
    };

    Date.fromJSONDate = function( jsonDate ) { return eval( jsonDate.replace( /\/Date\((-?\d+)\)\//gi, "new Date($1)" ) ); };

    $.styleJSON = function( json, options, callback ) {return $.fn.styleJSON( json, options, callback );};

    $.styleJSON.defaults = {

    		// array tag to use for arrays 
    		useArrayTag : "ul",

    		// JavaScript Date Format
    		// http://blog.stevenlevithan.com/archives/date-time-format
    		// use Date Format script for formatting dates
    		useDateFormat: true,

    		// flag to use ajax to load date.format.js
    		// if false, will use <script /> tag
    		useDateFormatAjaxLoad : true,
    		// path to date.format.js
    		dateFormatPath: "js/date.format.js",

			// format for the dateFormat script
    		dateFormat : "dddd, mmmm d, yyyy"
    };

    $.fn.styleJSON = function( json, template, callback ){

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
    	/* end utility functions */


        /**
         * standardize object types
         */
        function typeOf( o ) {
        	if ( o == null ) return 'undefined'; // "fix" javascript's typeof null === 'object' gotcha

        	if ( typeof o == 'string' )
        		return 'string';
        	else if ( typeof o == 'object' ) {
        		if ( isArray( o ) )
        			return 'array';
        		else 
        			return 'object';
        	}
        }

        /**
         * "drill down" into a data source by the given key
         */
        function tryDrilldown( key, obj) {
            var arr = key.split('.'),
                arrlen = arr.length,
                o = obj;

            for (var i = 0; i < arrlen; i++) {
                if ( o.hasOwnProperty( arr[i] ) ){
                    o = o[ arr[i] ];
                }
            }
            if ( o == obj ) {
                return null;
            } else {
                return o;
            }
        }

        /**
         * process keys
         */
        function processKey( arr, ele, parent ){
            var _parent =  parent ? parent : ele.parent(),
                len = parent ? (!arr ? 0 : arr.length) : arr.length-1;
            for (x = 0; x < len; x++) {
                var _to = ele.clone();
                _to.appendTo( _parent );
            }
        }

        /**
         * parse a JSON date string and add parsed text to given element.
         */
        function parseDate( txt, ele ){
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
        			var script = make( 'script', true ), s = document.getElementsByTagName( 'script' )[0];
        			script.type = 'text/javascript';
    				script.async = true; // HTML5 async
        			script.src = defs.dateFormatPath;
        			script.onload = function(){
            			txt = dateFormat( txt, defs.dateFormat );
            			ele.text( txt );
        			};
        			s.parentNode.insertBefore( script, s );
        		}
        	} catch(e){
        		debug('error parsing Date string.');
    		}
        }

        function typeofContext(ctx){
            if ( ctx.hasOwnProperty("hasKey") && ctx.hasOwnProperty("types") ) return ctx;
            var o = {types:[], hasKey:false};

            for (var p in ctx) {
                if ( p == 'key' ) o.hasKey = true;
                o.types.push( typeof ctx[p] );
            }
            return o;
        }

        /**
         * @function
         * exploratory object extended to another object.
         */
        var Context = function( ) {
            var props = typeofContext( this );
            for (var p in props) {
                if ( !this.hasOwnProperty( p ) ) {
                    this[p] = props[p];
                }
            }
            return this;
        };

    	function parseString( property, ctx, to, dataCtx, ele ) {
            // check data for ctx[ property ]
        	var formatted = false;
            txt = dataCtx[ ctx[ property ] ] ? dataCtx[ ctx[ property ] ] : '';
            if ( isDateString( txt ) ){
            	parseDate( txt, ele );
            	formatted = true;
            }

            if ( isMultiClass( ctx[ property ] ) ) {
            	var classes = ctx[ property ].split(' '), nclass = classes.length;
            	for ( var v = 0; v < nclass; v++) {
            		ele.addClass( classes[ v ] );
            		txt = dataCtx[ classes[ v ] ] ? dataCtx[ classes[ v ] ] : txt; 
                    if ( isDateString( txt ) && !formatted ){
                    	parseDate( txt, ele );
                    	formatted = true;
                    }
            	}
            	ele.appendTo( to );
            } else {
                ele.addClass( ctx[ property ] ).appendTo( to );
            }

            // check if it is a link
            if ( !formatted ) {
                if ( !isLinkTag( txt ) ) {
                	ele.text( txt );
            	} else {
                	ele.html( txt );
            	}
            }
    	}

        function parseHTMLElements( property, ctx, to, dataCtx ){
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
	                        	parseString( property, ctx, to, dataCtx, ele );
	                        } else {
	                            if ( isArrayTag( property ) ) {
	                                var _arr = tryDrilldown( key, dataCtx );
	                                processKey( _arr, make(property), to );
	                                look( ctx[ property ], _arr, to );
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
	                                    	parseDate( txt, ele );
	                                    }
	                            	}
	                            	ele.appendTo( to );
	                            } else {
		                            txt = dataCtx[ _a[x] ] ? dataCtx[ _a[x] ] :
		                                    dataCtx[ key ] && dataCtx[ key ][ _a[x] ] ? dataCtx[ key ][ _a[x] ] : '';
		                            var _o = make( property );
		                            _o.addClass( _a[x] )
		                                .appendTo( to );
	                                if ( isDateString( txt ) ){
	                                	parseDate( txt, _o );
	                                } else {
			                            if ( !isLinkTag( txt ) ) {
			                            	_o.text( txt );
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
	                            var arr = tryDrilldown( key, dataCtx );
	                            processKey( arr, ele );
	                        }
	                        look( ctx[ property ], dataCtx, ele );
	                    	break;
                    }

                    return true;
                } else continue;
            }   // end loop
            return false;
        }

        function look( ctx, dataCtx, to ) {

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
	                            	if ( isArrayTag( p ) ) {
	                            		debugger;
	                            	}
	                            } else {
	                                look( ctx, dataCtx[ v ], ele );
	                            }
	                        }
	                        break;
	                    } else if ( isArray( ctx ) ) {
	                        var clen = ctx.length;
	                        for ( var z = 0; z < clen; z++ ) {
	                            look( ctx[ z ], dataCtx, to );
	                        }
	                        break;
	                    }

	                	isHtml = parseHTMLElements( p, ctx, to, dataCtx );

	                    if ( isHtml || p == 'key' ) continue;

	                    //parse unknown nodes
	                    switch ( type ) {

		                    case "string":
		                        var txt = dataCtx[ ctx[ p ] ] ? dataCtx[ ctx[ p ] ] : '';
		                        // TODO: check data for ctx[p]
		                        to.addClass( ctx[ p ] );
		                        if ( !isLinkTag( txt ) ) {
		                        	to.text( txt );
		                    	} else {
		                        	to.html( txt );
		                    	}
		                    	break;

		                    case "object":
		                        var div = make( 'div' );
		                        div.addClass( p ).appendTo( to );
		                        if ( ctx.hasKey ) {
		                            var arr = tryDrilldown( key, dataCtx );
		                            if ( isArray( arr ) ) {
		                                dataCtx = arr;
		                                div.remove();
		                                div = make( defs.useArrayTag );
		                                div.addClass( p )
		                                    .appendTo( to );
		                            }
		                            processKey( arr, make('li'), div );
		                        }
		                        look( ctx[ p ], dataCtx, div );
		                    	break;
	                    }
	                } // end property loop
	            	break;

            	case "string":
//            		parseString( props[ ctx ], ctx, to, dataCtx, to );
            		to.addClass( ctx );
        		break;
            }
        }

        var defs = $.styleJSON.defaults || {},
            omap = 'div span h1 h2 h3 section ul ol li p i b label'.split(' '),
            arrayTags = 'ol ul'.split(' '),
            isArrayTag = function( str ) {return /ul|ol|li/gi.test(str);},
            isLinkTag = function( str ) {return /<a[^>]*>(.*?)<\/a>/gi.test(str);},
    		isMultiClass = function( str ) { return str.split( ' ' ).length > 1; },
            data = null,
            inc = 0,
            cb = typeof callback == 'function' ? callback : jQuery.noop,
    		len = this.length ? ( this.length ) : false,
			me = this,
			isDateString = function( d ){ return /Date\(\d*\)/g.test( d ); },
			isDateFormatLoaded = function(){ if ( typeof dateFormat == 'function' ) return true; else return false;};

        if ( !len ) {
        	return $('body').style( json, template );
        }

        function debug(msg){
    		if ( console && console.log ) console.log( msg );
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
    		if ( $.isArray( array ) ) {
    			return {
					data: dressArrayData( array ),
					template: dressTemplate( template )
    			};
    		} else {
    			return { data: array, template: template };
    		}
        }

        function callbacking(m, j){
            if ( (len-1) == inc ) {
	            if ( cb ) {
	            	inc=0;
	            	cb.call(m, m, j);
	            }
            }
        	inc++;
        }

        // BUG : if multiple elements matched, it will make this.length amount of GET requests.
        return this.each(function(){

            var $this = $(this),
            	_o = {};

            if ( typeof json == 'string' && data == null ) {
                $.getJSON( json, function(_d){
                	data = json = _d;
            		_o = handleIfArrayData( data, template );
                    look( _o.template, _o.data, $this );
                })
                .error(function(e){
                	if (e.responseText) {
                		json =  data = eval( '('+e.responseText+')' );
                		if ( typeof json == 'object' )
                			_o = handleIfArrayData( json, template );
                		look( _o.template, _o.data, $this );
                	} else {
                		debug( 'An error occured.' );
                	}
                })
                .complete(function(){
                	callbacking(me, json);
                });
            } else if (typeof json == 'object' ) {
            	_o = handleIfArrayData( data = json, template );
                look( _o.template, _o.data, $this );
                callbacking(me, json);
            }
        });
    };

})( window.jQuery, undefined );