define([
	"application",

	// Libs
	"jquery",
	"use!backbone",
],

function(application, $, Backbone) {
	
	var ItemList = application.module();
	
	ItemList.Model = Backbone.Model.extend({
	});
	
	ItemList.Collection = Backbone.Collection.extend({
		model: ItemList.Model
	});
	
	ItemList.View = Backbone.View.extend({
		
		template: "modules/list/list.html",
		
		initialize: function() {
			this.collection.bind('add', this.refresh_list, this);
		},
		
		render: function(done) {
			
			var view = this;
			
			application.fetchTemplate(this.template, function(template){
				view.el.innerHTML = application.compiles(template, {items: view.collection.toJSON()});
				
				if(_.isFunction(done)){
					done(view);
				}
			});
		},
		
		refresh_list: function() {
			this.render();
		}
	});
	
	return ItemList;
});