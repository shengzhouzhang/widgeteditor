/**
 * 
 * This is the module for console.
 * 
 * @author Steven Zhang
 * @version 1.0 February 24, 2013.
 */
define([
	"application",

	// Libs
	"jquery",
	"use!backbone",
],

function(application, $, Backbone) {
	
	var JSConsole = application.module();
	
	JSConsole.Model = Backbone.Model.extend({
	});
	
	JSConsole.View = Backbone.View.extend({
		
		template: "modules/jsconsole/jsconsole.html",
		
		render: function(done) {
			
			var view = this;
			
			application.fetchTemplate(this.template, function(template){
				
				view.el.innerHTML = application.compiles(template, {});
				
				$(view.el).find("#jsconsole_container").first().css("width", "209px");
				
				$(view.el).find("#preview_frame").css("width", "420px");
				
				window.onerror = function(msg, url, line) {
					view.logging(msg, "error");
		      	};
		      	
		        //add post message listener
				view.listening(function() {
					if(_.isFunction(done)){
						done(view);
			        }
				});
			});
		},
		
		logging: function(message, style) {
			var log = $("<li>").html('<span class="sign">&gt;</span><span>' + message + '</span>');
			log.find("span").last().addClass(style);
			$(this.el).find("ul.logs").prepend(log);
		},
		
		clean: function() {
			console.log($(this.el).find("ul.logs"));
			$(this.el).find("ul.logs").html('');
		},
		
		listening: function(done) {
			
			var view = this;
			
			var receiveMessage = function(e) {
	    		if(e.data.type === "ready") {
	    			if(_.isFunction(done)){
			        	done(view);
			        }
	    			return;
	    		}
	    		if(e.data.line)
	    			view.logging(e.data.content + " #line: " + e.data.line, e.data.style);
	    		else
	    			view.logging(e.data.content, e.data.style);
	    	};

	    	window.addEventListener("message", receiveMessage, false);
	    	
	    },
		
	});
	
	return JSConsole;
});