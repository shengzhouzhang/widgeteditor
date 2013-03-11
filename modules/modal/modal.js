/**
 * 
 * This is the module for pop out window.
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
	
	var Modal = application.module();
	
	Modal.Model = Backbone.Model.extend({
	});
	
	Modal.View = Backbone.View.extend({
		
		template: "modules/modal/modal.html",
		
		render: function(done) {
			
			var view = this;
			
			application.fetchTemplate(this.template, function(template){
				
				view.el.innerHTML = application.compiles(template, view.model.toJSON());
				
				if(_.isFunction(done)){
					done(view);
				}
			});
		},
	});
	
	return Modal;
});