/**
 * 
 * @preserve styleJSON
 * version 2.0-standalone
 *	jQuery addon 1.0
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
 * 
 * 
 * jQuery test
 * 
 * $('.demos').styleJSON(
 *		{	// data
 *			"name" : "Daniel Brooks",
 *			"test" : {
 *				"more" : {
 *					"levels" : [
 *						{
 *							"id" : 1,
 *							"title" : "the first item"
 *						},
 *						{
 *							"id" : 2,
 *							"title" : "the second item"
 *						}
 *					]
 *				}
 *			}
 *		},
 *		{	// styles
 *			"div":"name",
 *			key : "test.more.levels",
 *			levels: { span : ["id","title"] }
 *		},
 *		{	// options
 *			before: function(a,b,c) { },
 *			completed: function( a,b,c ){ }
 *		}
 *	);
 */

$(function(){

	'use strict';

	(function( $, sj ){

	    $.styleJSON = function( data, template, opts /** json_data, template, options|callback */ ){
	    	$( document.body || document.getElementsByTagName('body')[0] ).styleJSON( data, template, opts );
	    };

	    $.fn.styleJSON = function( data, template, opts /** json_data, template, options|callback */ ){

	    	var _data = data;
	    	opts = $.extend( {isjQuery:true}, opts || {} );

	        return this.each(function(){
	        	var me = this;
		    	if ( typeof _data === 'string' ) {
		    		// leverage jQuery's getJSON
		    		$.getJSON(data, function(d){
		    			if (d) { 
		    				_data = d;
		    			}
		    			sj.init( me, _data, template, opts );
		    		});
		    	} else if ( typeof _data === 'object' ) {
		    		sj.init( me, _data, template, opts );
		    	}
	        });
	    };

	})( jQuery, styleJSON );
});
