(function( $ ) {

    var make = function( tag, jQele ){
        if ( !jQele )
            return $( document.createElement( tag ) );
        else
            return document.createElement( tag );
    };

    function qryObj( qry, obj ) {
        var q = qry.split('.'),
            str = '', o = {};
        for (var i = 0; i < q.length; i++) {
            var last = (i + 1) < q.length ? false : true;

            try {
                if ( obj [q[ i ] ] || o[ q[ i ] ] ) {
                    str += q[i] + (!last ? '.' : '');
                    o = obj[ q[ i ] ] || o[ q[ i ] ];
                    if ( $.isArray( o ) ) {
                        return o;
                    } else if ( typeof o == 'object' ){
                        continue;
                    }
                    continue;
                }
            } catch (exception) {
                debugger;
                break;
            }
        }
    }

    function tryObj( key, obj) {
        var arr = key.split('.'),
            arrlen = arr.length,
            o = obj;
        debugger;
        for (var i = 0; i < arrlen; i++) {
            if ( o.hasOwnProperty( arr[i] ) ){
                o = o[ arr[i] ];
            } else if ( $.isArray( o ) ) {
                for (var x = 0; x < o.length; x++) {
                    if ( o[ x ][ arr[i] ] ) {
                        debugger;
                    }
                }
            }
        }
        if ( o == obj ) {
            return null;
        } else { //if ( $.isArray( o ) || typeof o == 'object' ){
            return o;
        }
    }

    function procKey(arr, ele, parent){
        var _parent =  parent ? parent : ele.parent(),
            len = parent ? arr.length : arr.length-1;
        for (x = 0; x < len; x++) {
            var _to = ele.clone();
            _to.appendTo( _parent );
        }
    }

    function inspectObj( obj ) {
        var arr = [];
        if ( $.isArray( obj ) ) {
            for (var i = 0; i < obj.length; i++) {
                if ( $.isArray( obj[i] ) ) {
                    arr.push( inspectObj( obj[i] ) );
                } else if ( typeof obj[i] == 'object' ) {
                    arr.push( inspectObj( obj[i] ) );
                }
            }
        } else if ( typeof obj == 'object' ) {
            for (var p in obj ) {
                arr.push( typeof p );
            }
        }
        return arr;
    }

    function parseHTMLElements( property, ctx, to, dataCtx ){
        var m = omap, ele = null, key = ctx['key'];
        for (var i = 0; i < m.length; i++) {
            // node matches html element
            if ( property == m[i]){
                ele =
                    make( property );
                if ( typeof ctx[ property ] == 'string' ){
                    if ( !key ) {
                        ele.addClass( ctx[ property ] ).appendTo( to );
                    } else {
                        if ( isArrayTag( property ) ) {
                            var _arr = tryObj( key, dataCtx );
                            procKey( _arr, make(property), to );
//                                var _z = inspectObj( _arr );
                            look( ctx[ property ], _arr, to );
                            debugger;
                        }
                    }
                } else if ( typeof ctx[ property ] == 'object' ){
                    ele.appendTo( to );
                    // worm through..
                    if ( key != null ) {
                        var arr = qryObj( key, dataCtx );
                        procKey( arr, ele );
                    }
                    look( ctx[ property ], dataCtx, ele );
                }
                return true;
            } else continue;
        }
        return false;
    }

    function typeofContext(ctx){
        if ( ctx.hasKey && ctx.types ) return ctx;
        var o = {types:[], hasKey:false};

        for (var p in ctx) {
            if ( p == 'key' ) o.hasKey = true;
            o.types.push( typeof ctx[p] );
        }

        return o;
    }

    var Context = function( ) {
        var types = typeofContext( this );
        for (var p in types) {
            if ( !this.hasOwnProperty( p ) ) {
                this[p] = types[p];
            }
        }
        return this;
    }

    function look( ctx, dataCtx, to ) {

        debugger;
        var _ctx = Context.call( ctx );
//        var _ctx = Context( ctx );
//        ctx = typeof ctx == 'string' ? dataCtx : ctx;
        if ( typeof ctx == 'object' ) {
            var props = Object.keys( ctx );
    //        for (var p in ctx) {
            for( var i = 0; i < props.length; i++ ){
                if ( props[i] == 'types' || props[i] == 'hasKey' ) continue;
                var ele = null, pass = false, key = ctx['key'], p = props[i];

                if ( $.isArray( dataCtx ) && !$.isArray( ctx ) ) {
                    var n = dataCtx.length;
                    for (var v = 0; v < n; v++) {
                        ele = to.children('li').eq( v );
                        look( ctx, dataCtx[ v ], ele );
                    }
                } else if ( $.isArray( ctx ) ) {
                    var clen = ctx.length;
                    for (var z = 0; z < clen; z++) {
                        look( ctx[z], dataCtx, to );
                    }
                }

                pass = parseHTMLElements( p, ctx, to, dataCtx );

                if ( pass || p == 'key' ) continue;

                //parse unknown nodes
                if ( typeof ctx[ p ] == 'string' ){
                    to.addClass( ctx[ p ] );
                } else if (typeof ctx[ p ] == 'object' && ctx[p] != null){
                    var div = make( 'div' );
                    div.addClass( p ).appendTo( to );
                    if ( ctx.hasKey ) {
                        var arr = tryObj( key, dataCtx );
                        if ( $.isArray( arr ) ) {
                            debugger;
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

    var omap = 'div,span,h1,h2,h3,section,ul,ol,li,p,i,b,label,table,thead,th,tbody,tr,td'.split(',');

    var isArrayTag = function( str ) {return /ul|ol|li/gi.test(str);};

    var defaults = {},
        data = {},
        style;

        style = {
            cutObject : function(a, b){
                var akeys = Object.keys(a),
                    bkeys = Object.keys(b),
                    s = '',m = omap,

                    existIn = function(str, obj){
                        for (var i = 0; i < obj.length; i++) {
                            if ( str == obj[i] ) {
                                s = akeys[x];
                                pass = true;
                                break;
                            }
                        }
                    },

                    checkHtml = function( arr, o ){
                        for (var z = 0; z < arr.length; z++) {
                            for (var x = 0; x < m.length; x++) {
                                if ( arr[z] == m[x] ){
                                    return o[ arr[z] ];
                                }
                            }
                        }
                        return null;
                    };

                var pass = false;
//                for (var i = 0; i < akeys.length; i++){
                    for(var x = 0; x < bkeys.length; x++){
                        existIn( bkeys[x], akeys );
//                        if ( akeys[i] == bkeys[x] ){
//                            s = akeys[x];
//                            pass =true;
//                            break;
//                        }
//                        else {
//                            debugger;
//                            var o = checkHtml( bkeys, b );
////                            for ()
//                            debugger;
//                            delete akeys[x];
//                        }
                    }
                    if ( !pass ){
                        var o = checkHtml( bkeys, b );
                    }
//                }
            }
        };

//    $.toString = function(){
//        debugger;
//        var $this = $(this);
//
//    };

    $.style = function( json, options ) {return $.fn.style( json, options );};

    $.fn.style = function( json, options ){

        var d = json || {},
            $this = $(this),
            template = $.extend( defaults, options || {} );
            data = d;

            if ( $this.selector && typeof $this.selector == 'string' ) {
                //$this.context;
            }

//            tryObj( d, "data.items" );
debugger;
//            look.apply( $this, [template, d, $this] )
            template = style.cutObject.call($this, d, template);
            look( template, d, $this );
            return $this;
    };

})( window.jQuery );

$.getJSON('skills.json', function(j){
    $('.root').style( j,
        {
            "span": {
                author : 'author'
            },
            data: { // as if saying <div class="data">...
                "span" : "title",   // <span class="title">...
                "div" : {   // <div>...
                    key : "data.items", // map reference to the data
                    items: {    // has to be named the last object map key (data["items"]
                       "span" : "title",
                       "ul" : {
                           key : "data.items.experience",
                           experience : {
                               "li" : "experience"
                           }
                       }
                    }
                }
            }
        }
    );
});