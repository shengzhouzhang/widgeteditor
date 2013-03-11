/**
 * 
 * Some global methods definition.
 * <p>
 * e.g. fetchTemplate, compiles.
 * 
 * @author Steven Zhang
 * @version 1.0 February 24, 2013.
 */
define([
	// Libs
	"jquery",
	"use!backbone",
],

function($, Backbone) {
	
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
	        	if (_.isFunction(done)) {
	        		done(content);
	        	}
	        }
		});
	};
	
	Application.save = function(url, method, data, done) {
		
		var send = {creator_name: data.creator_name}
		$.ajax({
	        url: url,
	        type: method,
	        contentType: "application/json",
	        data: JSON.stringify(data),
	        dataType: "json",
	        success: function(content) {	
	        	if (_.isFunction(done)) {
	        		done(content);
	        	}
	        },
	        error: function(content) {
	        	if (_.isFunction(done)) {
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