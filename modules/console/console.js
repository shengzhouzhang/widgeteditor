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
				
				$(view.el).find("input").first().width(180);
				
				$(view.el).find("#preview_frame").css("width", "420px");
				
				//add post message listener
				view.listening();
				
		        if(_.isFunction(done)){
		        	done(view);
		        }
			});
		},
		
		events: {
			"keypress input": "event_enter"
		},
		
		event_enter: function(e){
			
			if (e.keyCode === 13) {
				e.preventDefault();
			}
		},
		
		logging: function(message, style) {
			var log = $("<li>").html('<span class="sign">&gt;</span><span>' + message + '</span>');
			log.find("span").last().addClass(style);
			$(this.el).find("ul.logs").prepend(log);
		},
		
		listening: function() {
			
			var view = this;
	    	
	    	// Create IE + others compatible event handler
	    	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	    	var eventer = window[eventMethod];
	    	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	    	
	    	// Listen to message from child window
	    	eventer(messageEvent,function(e) {
	    		view.logging(e.data.content, e.data.style);
	    	},false);
	    },
		
	});
	
	return JSConsole;
});