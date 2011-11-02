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
 * @version 1.0 
 */

(function( $ ) {

    if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o))
            throw new TypeError('Object.keys called on non-object');
        var ret=[],p;
        for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
        return ret;
    };

    $.styleJSON = function( json, options, callback ) {return $.fn.styleJSON( json, options, callback );};

    $.styleJSON.defaults = {
    		arrayTag : "ul"
    };

    $.fn.styleJSON = function( json, template, callback ){

        function make( tag, jQele ){
            if ( !jQele )
                return $( document.createElement( tag ) );
            else
                return document.createElement( tag );
        }

        function tryObj( key, obj) {
            var arr = key.split('.'),
                arrlen = arr.length,
                o = obj;

            for (var i = 0; i < arrlen; i++) {
                if ( o.hasOwnProperty( arr[i] ) ){
                    o = o[ arr[i] ];
                } /*else if ( $.isArray( o ) ) {
                    for (var x = 0; x < o.length; x++) {
                        if ( o[ x ][ arr[i] ] ) {
//                            debugger;
                        }
                    }
                }*/
            }
            if ( o == obj ) {
                return null;
            } else {
                return o;
            }
        }

        function procKey(arr, ele, parent){
            var _parent =  parent ? parent : ele.parent(),
                len = parent ? (!arr ? 0 : arr.length) : arr.length-1;
            for (x = 0; x < len; x++) {
                var _to = ele.clone();
                _to.appendTo( _parent );
            }
        }

        function parseHTMLElements( property, ctx, to, dataCtx ){
        	if ( property == "key" ) return;
            var m = omap, ele = null, key = ctx['key'], txt;
            for (var i = 0; i < m.length; i++) {
                // node matches html element
                if ( property == m[i]){
                    ele = make( property );
                    if ( typeof ctx[ property ] == 'string' ){
                        if ( !ctx.hasKey ) {
                            // check data for ctx[ property ]
                            txt = dataCtx[ ctx[ property ] ] ? dataCtx[ ctx[ property ] ] : '';
                            /*if ( isMultiClass( ctx[ property ] ) ) {
                                // TODO: handle multi-class
                            } else {*/
                                ele.addClass( ctx[ property ] ).appendTo( to );
                            /*}*/
                            if ( !isLinkTag( txt ) ) {ele.text( txt );}
                            else {ele.html( txt );}
                        } else {
                            if ( isArrayTag( property ) ) {
                                var _arr = tryObj( key, dataCtx );
                                procKey( _arr, make(property), to );
    //                                var _z = inspectObj( _arr );
                                look( ctx[ property ], _arr, to );
                            }
                        }
                    } else if ( $.isArray( ctx[ property ] ) ){
                        var _a = ctx[ property ];
                        for (var x = 0; x < _a.length; x++) {
                            txt = dataCtx[ _a[x] ] ? dataCtx[ _a[x] ] :
                                    dataCtx[ key ] && dataCtx[ key ][ _a[x] ] ? dataCtx[ key ][ _a[x] ] : '';
                            var _o = ele.clone();
                            _o.addClass( _a[x] )
                                .appendTo( to );
                            if ( !isLinkTag( txt ) ) {_o.text( txt );}
                            else {_o.html( txt );}
                        }
                    } else if ( typeof ctx[ property ] == 'object' ){
                        ele.appendTo( to );
                        // worm through..
                        if ( ctx.hasKey ) {
                            var arr = tryObj( key, dataCtx );
                            procKey( arr, ele );
                        }
                        look( ctx[ property ], dataCtx, ele );
                    }
                    return true;
                } else continue;
            }   // end loop
            return false;
        }

//        var checkMultiClass = function( str, ele, to ) {
//
//            var len = str.split(' ').length, a = [];
////            if ( len > 1 ){
////                for ( var x = 0; x < len; x++ ){
////                    ele.addClass( arr[ x ] );
////                    a.push( arr[x] );
////                }
////            } else {
////                ele.addClass( str );
////            }
////            ele.appendTo( to );
//        };

        function typeofContext(ctx){
            if ( ctx.hasOwnProperty("hasKey") && ctx.hasOwnProperty("types") ) return ctx;
            var o = {types:[], hasKey:false};

            for (var p in ctx) {
                if ( p == 'key' ) o.hasKey = true;
                o.types.push( typeof ctx[p] );
            }

            return o;
        }

        var Context = function( ) {
            var props = typeofContext( this );
            for (var p in props) {
                if ( !this.hasOwnProperty( p ) ) {
                    this[p] = props[p];
                }
            }
            return this;
        };

        function look( ctx, dataCtx, to ) {

            Context.call( ctx );
            if ( typeof ctx == 'object' ) {
                var props = Object.keys( ctx );

                for( var i = 0; i < props.length; i++ ){
                    if ( props[i] == 'types' || props[i] == 'hasKey' ) continue;
                    var ele = null, isHtml = false, key = ctx['key'], p = props[i];

                    if ( $.isArray( dataCtx ) && !$.isArray( ctx ) ) {
                        var n = dataCtx.length;
                        for (var v = 0; v < n; v++) {
                            ele = to.children('li').eq( v );
                            if ( !ele.length ) {
                            	if ( isArrayTag( p ) ) { }
                            } else {
                                look( ctx, dataCtx[ v ], ele );
                            }
                        }
                        break;
                    } else if ( $.isArray( ctx ) ) {
                        var clen = ctx.length;
                        for (var z = 0; z < clen; z++) {
                            look( ctx[z], dataCtx, to );
                        }
                        break;
                    }

                	isHtml = parseHTMLElements( p, ctx, to, dataCtx );

                    if ( isHtml || p == 'key' ) continue;

                    //parse unknown nodes
                    if ( typeof ctx[ p ] == 'string' ){
                        var txt = dataCtx[ ctx[ p ] ] ? dataCtx[ ctx[ p ] ] : '';
                        // TODO: check data for ctx[p]
                        to.addClass( ctx[ p ] );
                        if ( !isLinkTag( txt ) ) {to.text( txt );}
                        else {to.html( txt );}
                    } else if (ctx[ p ] != null && typeof ctx[ p ] == 'object' ){
                        var div = make( 'div' );
                        div.addClass( p ).appendTo( to );
                        if ( ctx.hasKey ) {
                            var arr = tryObj( key, dataCtx );
                            if ( $.isArray( arr ) ) {
                                dataCtx = arr;
                                div.remove();
                                div = make( 'ul' );
                                div.addClass( p )
                                    .appendTo( to );
                            }
                            procKey( arr, make('li'), div );
                        }
                        look( ctx[ p ], dataCtx, div );
                    }
                } // end loop over properties
            } else if ( typeof ctx == 'string' ){
                to.addClass( ctx );
            }
        }

        var defs = $.styleJSON.defaults || {},
            omap = 'div,span,h1,h2,h3,section,ul,ol,li,p,i,b,label,table,thead,th,tbody,tr,td'.split(','),
            arrayTags = 'ol,ul'.split(','),
            isArrayTag = function( str ) {return /ul|ol|li/gi.test(str);},
            isLinkTag = function( str ) {return /<a[^>]*>(.*?)<\/a>/gi.test(str);},
    		isMultiClass = function( str ) { return str.split( ' ' ).length > 1; },
            data = null,
            inc = 0,
            cb = typeof callback == 'function' ? callback : jQuery.noop,
    		len = this.length ? ( this.length ) : false,
			me = this;

        if ( !len ) {
        	return $('body').style( json, template );
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
                	var arr;
                	if (e.responseText) {
                		arr  = json =  data = eval( '('+e.responseText+')' );
                		_o = handleIfArrayData( arr, template );
                		look( _o.template, _o.data, $this );
                	} else {
                		if ( console ) console.log( 'An error occured.' );
                	}
                })
                .complete(function(){
                	callbacking(me, json);
                });
            } else if (typeof json == 'object' ) {
            	_o = handleIfArrayData( json, template );
                look( _o.template, _o.data, $this );
                callbacking(me, json);
            }
        });
    };

})( window.jQuery, undefined );