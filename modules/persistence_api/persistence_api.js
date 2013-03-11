/**
 * 
 * This is the module for persistence API
 * <p>
 * e.g. saving, fetching of widgets or widget list
 * 
 * @author Steven Zhang
 * @version 1.0 February 24, 2013.
 */
define([
	"application",
	
	// Libs
	"jquery",
	"use!backbone",
	"github",
	
	//config
	"rest"
],

function(application, $, Backbone, Github, Rest) {
	
	var Persistence = {};
	
	// Persistence API for remote service
	Persistence.remote_storage = function() {
		
		this.save = function(widget, done) {
			
			var url = null;
			var method = null;
			
			if(widget.isNew()) {
				url = Rest.base_uri;
				method = "POST";
			}else {
				url = Rest.base_uri + widget.get("creator_name") + "/" + widget.get("widget_name");
				method = "PUT";
			};
			
			var attrs = {
				creator_name : widget.get("creator_name"), 
				widget_name: widget.get("widget_name"),
				files: widget.get("files"),
				service_name: widget.get("service_name"),
				configurations: widget.get("configurations")
			};
			
			var options = {
				success: function(model, response) {
					console.log('saved');
					if(_.isFunction(done)) {
						done(model);
					};
				},
				error: function(model, response) {
					console.log('error');
					if(_.isFunction(done)) {
						done(model);
					};
				},
	    		url: url
			};
			
//			Backbone.Model.prototype.save.call(widget, attrs, options);
			
			application.save(url, method, widget.toJSON(), function(content) {
				if(typeof content.id !== undefined) {
					widget.id = content.id;
					console.log(content.id);
					options.success(widget, null);
				}else {
					options.error(widget, null);
				}
			});
		};
		
		this.fetch = function(widget, done) {
			
			url = Rest.base_uri + widget.get("creator_name") + "/" + widget.get("widget_name");
			
			var options = {
				success: function(){
					
					var config = widget.get("configurations");
					var files =  widget.get("files");
					
					var count = 0;
					
					if(config.load_from_html_link === true && typeof config.html_link !== "undefined") {
						count++;
					}
					if(config.load_from_javascript_link === true && typeof config.javascript_link !== "undefined") {
						count++;
					}
					if(config.load_from_css_link === true && typeof config.css_link !== "undefined") {
						count++;
					}
					if(config.load_from_container_link === true && typeof config.container_link !== "undefined") {
						count++;
					}
					
					if(config.load_from_html_link === true && typeof config.html_link !== "undefined") {
						application.load(config.html_link, function(content) {
							files.html = content;
							count--;
							if(count === 0 && _.isFunction(done)){
								widget.set("files", files);
			    				done(widget);
			    			}
						});
					}
					
					if(config.load_from_javascript_link === true && typeof config.javascript_link !== "undefined") {
						application.load(config.javascript_link, function(content) {
							files.javascript = content;
							count--
							if(count === 0 && _.isFunction(done)){
								widget.set("files", files);
			    				done(widget);
			    			}
						});
					}
					if(config.load_from_css_link === true && typeof config.css_link !== "undefined") {
						application.load(config.css_link, function(content) {
							files.css = content;
							count--;
							if(count === 0 && _.isFunction(done)){
								widget.set("files", files);
			    				done(widget);
			    			}
						});
					}
					if(config.load_from_container_link === true && typeof config.container_link !== "undefined") {
						application.load(config.container_link, function(content) {
							files.container = content;
							count--;
							if(count === 0 && _.isFunction(done)){
								widget.set("files", files);
			    				done(widget);
			    			}
						});
					}
					
	    			if(count === 0 && _.isFunction(done)){
	    				done(widget);
	    			}
	    		},
	    		url: url
			};
			
			Backbone.Model.prototype.fetch.call(widget, options);
		};
		
		this.fetch_collection = function(collection, options, done) {
			
			url = Rest.base_uri + options.service_name;
		
			var options = {
				success: function() {
	    			if(_.isFunction(done)){
	    				done(collection);
	    			}
	    		},
	    		url: url
			};

			Backbone.Collection.prototype.fetch.call(collection, options);
		};
	};
	
	Persistence.github_options = {
			username: null,
			password: null,
			auth: "basic",
			repowner: null,
			reponame: null,
			htmlpath: "template.html",
			javascriptpath: "widget.js",
			csspath: "style.css",
			containerpath: "run.js"
	};
	
	// Persistence API for github service
	
		
	Persistence.github_storage = function(options) {
		
		var github = new Github(options);
		
		var repo = new github.Repository();
		
		this.save = function(widget, done) {
			
			var files = widget.get("files");
			
			var count = 4;
			
			repo.write("master", htmlpath, files.html, "update html", function(err) {
				
				count--;
				
				if(count === 0 && _.isFunction(done) && err === null){
    				done(widget);
    			}else {
    				console.log(err);
    				parent.postMessage(err, "*"); 
    			}
			});		
			
			repo.write("master", javascriptpath, files.javascript, "update javascript", function(err) {
				
				count--;
				
				if(count === 0 && _.isFunction(done) && err === null){
    				done(widget);
    			}else {
    				console.log(err);
    				parent.postMessage(err, "*"); 
    			}
			});
			
			repo.write("master", csspath, files.css, "update css", function(err) {
				
				count--;
				
				if(count === 0 && _.isFunction(done) && err === null){
    				done(widget);
    			}else {
    				console.log(err);
    				parent.postMessage(err, "*"); 
    			}
			});
			
			repo.write("master", containerpath, files.container, "update container", function(err) {
				
				count--;
				
				if(count === 0 && _.isFunction(done) && err === null){
    				done(widget);
    			}else {
    				console.log(err);
    				parent.postMessage(err, "*"); 
    			}
			});
		};
		
		this.fetch = function(widget, done) {
			
			var files = {};
			
			repo.read("master", Persistence.github_options.htmlpath, function(err, content, sha) {
				files.html = content;
				repo.read("master", Persistence.github_options.javascriptpath, function(err, content, sha) {
					files.javascript = content;
					repo.read("master", Persistence.github_options.csspath, function(err, content, sha) {
						files.css = content;
						repo.read("master", Persistence.github_options.containerpath, function(err, content, sha) {
							files.container = content;
							widget.set("files", files);
							if(_.isFunction(done)){
			    				done(widget);
			    			}
						});
					});
				});
			});
		};
		
		this.fetch_collection = function(collection, options, done) {
			
		};
	};
	
	return Persistence;
	
});