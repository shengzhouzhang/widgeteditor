define([
	"application",

	// Libs
	"jquery",
	"use!backbone",
],

function(application, $, Backbone) {
	
	var Operations = application.module();
	
	Operations.Model = Backbone.Model.extend({
	});
	
	Operations.Collection = Backbone.Collection.extend({
		model: Operations.Model
	});
	
	Operations.View = Backbone.View.extend({
		
		template: "modules/operations/operations.html",
		
		render: function(done) {
			
			var view = this;
			
			application.fetchTemplate(this.template, function(template){
				
				var json = {operations: view.collection.toJSON()};
				
				view.el.innerHTML = application.compiles(template, json);
				
				$.each(json.operations, function(index, item) {
					if(_.isFunction(item.dropdown)) {
						$(view.el).find("li:eq(" + index +")").find("a.caret").bind("click", function(){
							item.dropdown(view);
						});
					}
				});
				
				if(_.isFunction(done)){
					done(view);
				}
			});
		},
		
		bind_events: function() {
		  	var view = this;
		  	_.each(view.collection.toJSON(), function(item){
		  		if(item.event && item.id)
		  			$(view.el).find("#"+item.id).first().bind('click', function(){
			  			item.event();
		  			});
		  	});
		},
	});
	
	return Operations;
});