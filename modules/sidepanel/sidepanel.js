define([
	"application",

	// Libs
	"jquery",
	"use!backbone",
],

function(application, $, Backbone) {
	
	var SidePanel = application.module();
	
	SidePanel.Model = Backbone.Model.extend({
	});
	
	SidePanel.View = Backbone.View.extend({
		
		template: "modules/sidepanel/sidepanel.html",
		
		render: function(done) {
			
			var view = this;
			
			application.fetchTemplate(this.template, function(template){
				
				view.el.innerHTML = application.compiles(template, {sidepanel: view.model.toJSON()});
				
				if(view.model.get("sidebar")){
					
					
					
					if(view.model.get("sidebar") === "right"){
						$(view.el).find("div.main").addClass("left");
						$(view.el).append($("<a>").addClass("sidebar"));
						$(view.el).find("a.sidebar").addClass("left");
						$(view.el).find("a.sidebar").css("border-right", "1px solid #A0A0A0");
					}
					
					if(view.model.get("sidebar") === "left") {
						$(view.el).find("div.main").addClass("right");
						$(view.el).append($("<a>").addClass("sidebar"));
						$(view.el).find("a.sidebar").addClass("right");
						$(view.el).find("a.sidebar").css("border-left", "1px solid #A0A0A0");
					}
					
					if(view.model.get("width")){
						$(view.el).find("div.main").css("width", view.model.get("width")-10);
						$(view.el).find("a.sidebar").css("width", 9);
					}
					
				}else {
					
					if(view.model.get("width")){
						$(view.el).find("div.main").css("width", view.model.get("width"));
					}

				}
				
				if(view.model.get("height")){
					$(view.el).css("height", view.model.get("height"));
					$(view.el).find("div.main").css("height", view.model.get("height"));
					$(view.el).find("a.sidebar").css("height", view.model.get("height"));
				}
				
				if(_.isFunction(done)){
					done(view);
				}
		        
			});
		},
		
		change_width: function(changes) {
			var container = $(this.el).find("div.main");
			container.css("width", container.width() + changes);
		},
		
		reset_width: function(width) {
			if(this.model.get("sidebar")){
				$(this.el).find("div.main").css("width", width-10);
				$(this.el).find("a.sidebar").css("width", 9);
			}else {
				$(this.el).find("div.main").css("width", width);
			}
		},
		
//		events: {
//			"click a.sidebar": "event_toggle"
//		},
		
//		event_toggle: function(e) {
//			$(this.el).find("div.main").toggle();
//		}
	});
	
	return SidePanel;
});
