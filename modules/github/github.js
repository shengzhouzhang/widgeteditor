/**
 * 
 * This is the module for Github API.
 * 
 * @author Steven Zhang
 * @version 1.0 February 24, 2013.
 */
define([
    "application",
	"base64",

	"jquery",
	"use!backbone",
],

function(application, Base64, $, Backbone) {
	
	var Github = function(options) {
		
		var API_URL = 'https://api.github.com';
		var username = options.username;
		var password = options.password;
		var token = options.token;
		var auth = options.auth;
		var repowner = options.repowner;
		var reponame = options.reponame;
	
		function _request(method, path, data, done, raw){
		
			function getURL() {
				var url = API_URL + path;
				return url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
			}
	
			var xhr = new XMLHttpRequest();
			if (!raw) {xhr.dataType = "json";}
	
			xhr.open(method, getURL());
			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status >= 200 && this.status < 300 || this.status === 304) {
						done(null, raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true);
					} else {
						done({request: this, error: this.status});
					}
				}
			};
			xhr.setRequestHeader('Accept','application/vnd.github.raw');
			xhr.setRequestHeader('Content-Type','application/json');
			if (
					(auth == 'oauth' && token) ||
					(auth == 'basic' && username && password)
			) {
				xhr.setRequestHeader('Authorization',auth == 'oauth'
					? 'token '+ token
							: 'Basic ' + Base64.encode(username + ':' + password)
				);
			}

			data ? xhr.send(JSON.stringify(data)) : xhr.send();
		};
	
		this.Repository = function() {
	      
			var repo = this;
			var repoPath = "/repos/" + repowner + "/" + reponame;
			
			// Create a new Repository
			this.New = function(done) {
				
				var data = {
						name: reponame,
						description: "This repository is created from widget editor.",
						private: false,
						auto_init: true
				};
				
				_request("POST", "/user/repos", data, function(err, res) {
					if(_.isFunction(done)){
						done(repo);
					}
				});
			};
			
			this.fetch = function(done) {
				
				if(_.isFunction(done)){
					done(repo);
				}
			};
			
			// Read file at given path
			this.read = function(branch, path, done) {
				repo.getSha(branch, path, function(err, sha) {
					if (!sha) return done("not found", null);
					repo.getBlob(sha, function(err, content) {
						done(err, content, sha);
					});
				});
			};
			
			// For a given file path, get the corresponding sha (blob for files, tree for dirs)
			this.getSha = function(branch, path, done) {
				// Just use head if path is empty
				if (path === "") return repo.getRef("heads/"+branch, done);
				repo.getTree(branch+"?recursive=true", function(err, tree) {
					var file = _.select(tree, function(file) {
						return file.path === path;
					})[0];
					done(null, file ? file.sha : null);
				});
			};
			
			// Retrieve the contents of a blob
			this.getBlob = function(sha, done) {
				_request("GET", repoPath + "/git/blobs/" + sha, null, done, 'raw');
			};
			
			// Retrieve the tree a commit points to
			this.getTree = function(tree, done) {
				_request("GET", repoPath + "/git/trees/"+tree, null, function(err, res) {
					if (err) return done(err);
					done(null, res.tree);
				});
			};
			
			// Write file contents to a given branch and path
			this.write = function(branch, path, content, message, done) {
				updateTree(branch, function(err, latestCommit) {
					if (err) return done(err);
					repo.postBlob(content, function(err, blob) {
						if (err) return done(err);
						repo.updateTree(latestCommit, path, blob, function(err, tree) {
							if (err) return done(err);
							repo.commit(latestCommit, tree, message, function(err, commit) {
								if (err) return done(err);
								repo.updateHead(branch, commit, done);
							});
						});
					});
				});
			};
			
			var currentTree = {
					"branch": null,
					"sha": null
			};
			
			// Uses the cache if branch has not been changed
			function updateTree(branch, done) {
				if (branch === currentTree.branch && currentTree.sha) return done(null, currentTree.sha);
				repo.getRef("heads/"+branch, function(err, sha) {
					currentTree.branch = branch;
					currentTree.sha = sha;
					done(err, sha);
				});
			}
			
			// Get a particular reference
			this.getRef = function(ref, done) {
				_request("GET", repoPath + "/git/refs/" + ref, null, function(err, res) {
					if (err) return done(err);
					done(null, res.object.sha);
				});
			};
			
			 // Update an existing tree adding a new blob object getting a tree SHA back
			this.updateTree = function(baseTree, path, blob, done) {
				var data = {
						"base_tree": baseTree,
						"tree": [
						         {
						        	 "path": path,
						        	 "mode": "100644",
						        	 "type": "blob",
						        	 "sha": blob
						         }
						]
				};
				_request("POST", repoPath + "/git/trees", data, function(err, res) {
					if (err) return done(err);
					done(null, res.sha);
				});
			};
			
			// Post a new blob object, getting a blob SHA back
			this.postBlob = function(content, done) {
				if (typeof(content) === "string") {
					content = {
							"content": content,
							"encoding": "utf-8"
					};
				}
	
				_request("POST", repoPath + "/git/blobs", content, function(err, res) {
					if (err) return done(err);
					done(null, res.sha);
				});
			};
		
			// Update the reference of your head to point to the new commit SHA
			this.updateHead = function(head, commit, done) {
				_request("PATCH", repoPath + "/git/refs/heads/" + head, { "sha": commit }, function(err, res) {
					done(err);
				});
			};
			
			// Create a new commit object with the current commit SHA as the parent
			// and the new tree SHA, getting a commit SHA back
			this.commit = function(parent, tree, message, done) {
				var data = {
						"message": message,
						"author": {
							"name": options.username
						},
						"parents": [
						            parent
						            ],
						"tree": tree
				};

		        _request("POST", repoPath + "/git/commits", data, function(err, res) {
		          currentTree.sha = res.sha; // update latest commit
		          if (err) return done(err);
		          done(null, res.sha);
		        });
			};
		};
		
//		this.Repo = function(options) {
//			reponame = options.reponame;
//			return new Github.Repository();
//		};
	};
	return Github;
});