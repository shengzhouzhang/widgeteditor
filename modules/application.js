define([
	// Libs
	"jquery",
	"use!backbone",
],

function($, Backbone) {
	
	/**
	 * jQuery.ajax mid - CROSS DOMAIN AJAX 
	 * ---
	 * @author James Padolsey (http://james.padolsey.com)
	 * @version 0.11
	 * @updated 12-JAN-10
	 * ---
	 * Note: Read the README!
	 * ---
	 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
	 */

//	jQuery.ajax = (function(_ajax){
//	    
//	    var protocol = location.protocol,
//	        hostname = location.hostname,
//	        exRegex = RegExp(protocol + '//' + hostname),
//	        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
//	        query = 'select * from html where url="{URL}" and xpath="*"';
//	    
//	    function isExternal(url) {
//	        return !exRegex.test(url) && /:\/\//.test(url);
//	    }
//	    
//	    return function(o) {
//	        
//	        var url = o.url;
//	        
//	        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
//	            
//	            // Manipulate options so that JSONP-x request is made to YQL
//	            
//	            o.url = YQL;
//	            o.dataType = 'json';
//	            
//	            o.data = {
//	                q: query.replace(
//	                    '{URL}',
//	                    url + (o.data ?
//	                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
//	                    : '')
//	                ),
//	                format: 'xml'
//	            };
//	            
//	            // Since it's a JSONP request
//	            // complete === success
//	            if (!o.success && o.complete) {
//	                o.success = o.complete;
//	                delete o.complete;
//	            }
//	            
//	            o.success = (function(_success){
//	                return function(data) {
//	                    
//	                    if (_success) {
//	                        // Fake XHR callback.
//	                        _success.call(this, {
//	                            responseText: (data.results[0] || '')
//	                                // YQL screws with <script>s
//	                                // Get rid of them
//	                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
//	                        }, 'success');
//	                    }
//	                    
//	                };
//	            })(o.success);
//	            
//	        }
//	        
//	        return _ajax.apply(this, arguments);
//	        
//	    };
//	    
//	})(jQuery.ajax);
	
	var Application = {};
	
	Application.fetchTemplate = function(path, done) {
		var JST = window.JST = window.JST || {};
	      var def = new $.Deferred();

	      // Should be an instant synchronous way of getting the template, if it
	      // exists in the JST object.
	      if (JST[path]) {
	        if (_.isFunction(done)) {
	          done(JST[path]);
	        }

	        return def.resolve(JST[path]);
	      }

	      // Fetch it asynchronously if not available from JST, ensure that
	      // template requests are never cached and prevent global ajax event
	      // handlers from firing.
	      $.ajax({
	        url: path,
	        type: "get",
	        dataType: "text",
	        cache: false,
	        global: false,

	        success: function(contents) {
	          JST[path] = contents;

	          // Set the global JST cache and return the template
	          if (_.isFunction(done)) {
	            done(JST[path]);
	          }

	          // Resolve the template deferred
	          def.resolve(JST[path]);
	        }
	      });

	      // Ensure a normalized return value (Promise)
	      return def.promise();
	};
	
	Application.load = function(url, done) {
		$.ajax({
	        url: url,
	        type: "get",
	        success: function(content) {	
//	        	console.log(content);
	        	if (_.isFunction(done)) {
//	        		done(content.responseText);
	        		done(content);
	        	}
	        }
		});
	};
	
	Application.compiles = function(template, data) {
		return _.template(template, data);
	};
	
	// Create a custom object with a nested Views object
	Application.module = function(additionalProps) {
      return _.extend({ Models: {}, Views: {} }, additionalProps);
    };

    // Keep active application instances namespaced under an app object.
    Application.app = _.extend({}, Backbone.Events);
    
    Application.extend = function(protoProps) {
    	var parent = this;
    	var child = function(){ return parent.apply(this, arguments); };

    	// Add static properties to the constructor function, if supplied.
    	_.extend(child, parent);

    	// Set the prototype chain to inherit from `parent`, without calling
    	// `parent`'s constructor function.
    	var Surrogate = function(){ this.constructor = child; };
    	Surrogate.prototype = parent.prototype;
    	child.prototype = new Surrogate;

    	// Add prototype properties (instance properties) to the subclass,
    	// if supplied.
    	if (protoProps) _.extend(child.prototype, protoProps);

    	// Set a convenience property in case the parent's prototype is needed
    	child._super = parent.prototype;

    	return child;
    };
	
    return Application;

});