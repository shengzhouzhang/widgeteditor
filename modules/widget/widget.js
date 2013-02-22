define([
	"application",

	// Libs
	"jquery",
	"use!backbone",
	"persistence",
	
	//config
	"rest"
],

function(application, $, Backbone, Persistence, Rest) {
	
	var Widget = application.module();
	
	Widget.Persistence = new Persistence.remote_storage();
		
	Widget.Model = Backbone.Model.extend({
		
		storage: Widget.Persistence,
		
		save: function(done) {
			this.storage.save(this, done);
		},
		
		fetch: function(done) {
			this.storage.fetch(this, done);
		},
		
		Persist: function(persist_api) {
			storage = persist_api;
		}
	});
	
	Widget.Collection = Backbone.Collection.extend({
	
		model: Widget.Model,
		
		storage: Widget.Persistence,
		
		fetch: function(service_name, done) {
			this.storage.fetch_collection(this, {service_name: service_name}, done);
		},
	});

	// Required, return the module for AMD compliance
	return Widget;
});