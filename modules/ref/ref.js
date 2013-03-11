/**
 * 
 * This is the module for reference link component.
 * <p>
 * e.g. Bootstrap link
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
	
	var Ref = application.module();
	
	Ref.Model = Backbone.Model.extend({
	});
	
	Ref.View = Backbone.View.extend({
		
		template: "modules/ref/ref.html",
		
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
	
	return Ref;
});