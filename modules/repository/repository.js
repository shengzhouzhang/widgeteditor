//define([
//
//	// Libs
//	"jquery",
//	"use!backbone",
//	"github",
//],
//
//function($, Backbone) {
	
	var Remote = {
			github: {
				repo: {
					
				}, 
				files: {} 
			}
	};
		
	Remote.github.Auth = function(username, password) {
		
		Remote.github.username = username;
			
		Remote.github.connection = new Github({
			  username: Remote.github.username,
			  password: password,
			  auth: "basic"
		});
		
	};
	
	Remote.github.setworkplace = function(repo_name, branch_name, html_path, javascript_path, css_path) {
		
		Remote.github.repo.name = repo_name;
		Remote.github.repo.branch = branch_name;
		Remote.github.repo.instance = Remote.github.connection.getRepo(Remote.github.username, Remote.github.repo.name);;
		Remote.github.files.path = {html: html_path, javascript: javascript_path, css: css_path};
	};
	
	Remote.github.repo.create = function(options, done) {
		Remote.github.repo.instance.createRepo(options);
	};
	
	Remote.github.repo.pull = function() {
		
		var repo = Remote.github.repo.instance;
		
		repo.read(Remote.github.repo.branch, Remote.github.files.path.html, function(err, data) {
			Remote.github.files.content = {html: data};
			console.log(data);
		});
		
		repo.read(Remote.github.repo.branch, Remote.github.files.path.javascript, function(err, data) {
			Remote.github.files.content = {javascript: data};
			console.log(data);
		});

		repo.read(Remote.github.repo.branch, Remote.github.files.path.css, function(err, data) {
			Remote.github.files.content = {css: data};
			console.log(data);
		});
	};
	
	Remote.github.repo.push = function() {
		
		var repo = Remote.github.repo.instance;
		
		repo.write(Remote.github.branch, Remote.github.files.path.html, Remote.github.files.content.html, 'commits from widget editor', function(err) {
			console.log(err);
		});
		
		repo.write(Remote.github.branch, Remote.github.files.path.javascript, Remote.github.files.content.javascript, 'commits from widget editor', function(err) {
			console.log(err);
		});
		
		repo.write(Remote.github.branch, Remote.github.files.path.css, Remote.github.files.content.css, 'commits from widget editor', function(err) {
			console.log(err);
		});
	};
//	
//	
//	return Remote;
//});