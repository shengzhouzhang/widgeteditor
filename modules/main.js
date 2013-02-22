require([
	"application",

	// Libs
	"jquery",
	"use!backbone",
	
	//modules
	"sidepanel",
	"editor",
	"jsconsole",
	"list",
	"operations",
	"ref",
	"widget",
	"modal",
	"persistence",
	
	//config
	"rest",
	
	"bootstrap"
],

function(application, $, Backbone, SidePanel, Editor, JSConsole, List, Operations, Ref, Widget, Modal, Persistence, Rest) {
	

	var window_width = $("html").width();
	var panel_width = window_width - 20;
	var panel_height = $("#main_container").height();
	
	$("#header_container").width(panel_width);
	$("#main_container").width(panel_width);
	$("#header_container").css("margin-left", 10);
	$("#header_container").css("margin-right", 10);
	$("#main_container").css("margin-left", 10);
	$("#main_container").css("margin-right", 10);
	
	var serview_list_panel = new SidePanel.View({
		el: $("#serive_list_container"),
		model: new SidePanel.Model({
			title: "Services",
			operations: "",
			content: "Test Content",
			width: "220",
			height: panel_height,
			sidebar: "right"
		})
	});
	
	var widget_list_panel = new SidePanel.View({
		el: $("#widget_list_container"),
		model: new SidePanel.Model({
			title: "Widgets",
			operations: '<div id="operations_container"></div>',
			content: "Test Content",
			width: "220",
			height: panel_height,
			sidebar: "right"
		})
	});
	
	var widget_code_panel = new SidePanel.View({
		el: $("#widget_code_container"),
		model: new SidePanel.Model({
			title: "Codes",
			settings: true,
			operations: '<div id="operations_container"></div>',
			content: '<div id="html_editor_container"></div><div id="javascript_editor_container"></div><div id="css_editor_container"></div>',
			width: panel_width - 220 * 3,
			height: panel_height,
		})
	});
	
	var widget_preivew_panel = new SidePanel.View({
		el: $("#widget_preview_container"),
		model: new SidePanel.Model({
			title: "Preview",
			operations: '<div id="operations_container"></div>',
			content: '<div id="preivew_jsconsole_container"></div><div id="container_container"></div>',
			width: "220",
			height: panel_height,
			sidebar: "left"
		})
	});
	
	var service_list = [
	    {name: "eBay", target: "ebay"},
        {name: "Facebook", target: "facebook"}, 
        {name: "Twitter", target: "twitter"}, 
        {name: "Linkedin", target: "linkedin"}, 
        {name: "Google Map", target: "googlemap"}, 
        {name: "Google Plus", target: "googleplus"},
        {name: "Others", target: "none"}
	];
	
	serview_list_panel.render(function(view){
		
		var services = new List.View({
			el: $(view.el).find("div.content").first(),
			collection: new List.Collection(service_list)
		});
		
		services.render(function(view){
			
			//click event of service list
			$(view.el).find("a").click(function(){
				
				$(view.el).find("a").removeClass("actived");
				$(this).addClass("actived");
				
				var service_name = $(this).attr("target");
				var widget_collection = new Widget.Collection([]);
				widget_collection.fetch(service_name, function(collection){
					
					
					var widget_list = [];
					
					$.each(collection.toJSON(), function(key, item){

						widget_list.push({name: item.widget_name, target: item.id});
					});

					widget_list_panel.render(function(view){
						
						var operations_data = [{text: "New", style: "right"}];
						
						var operations = new Operations.View({
							el: $(view.el).find("#operations_container"),
							collection: new Operations.Collection(operations_data)
						});
						
						var widgets = new List.View({
							el: $(view.el).find("div.content").first(),
							collection: new List.Collection(widget_list)
						});
						
						widgets.render(function(view){
							//click event of widget list
							$(view.el).find("a").click(function(){
								
								$(view.el).find("a").removeClass("actived");
								$(this).addClass("actived");
								
								var widget = collection.get($(this).attr("target"));
								widget.fetch(function(widget_content){
									init_view(widget_content);
								});
							});
						});
						
						operations.render(function(operation_view){
							
							$(operation_view.el).find("a").click(function(){
								
								var widget = new Widget.Model({
									creator_name: null,
									widget_name: null,
									files: backbone_template
								});
								
								init_view(widget);
							});
						});						
					});
				});
			});
		});
	});	
	
	var backbone_template = {
		html: "<!-- New File -->",
		javascript: "// New File",
		css: "/* New File */",
		container: "// New File"
	};
	
	
	var toggle = 0;
	
	
	function switch_views(done) {
		if(toggle === 0) {
			developer_view();
			toggle = 1;
		}else {
			normal_view();
			toggle = 0;
		}
		if(_.isFunction(done)){
			done();
		}
	}
	
	function developer_view() {
		$("#serive_list_container, #widget_list_container").find("div.main").hide();
		$("#widget_code_container").find("div.main").css("width", panel_width - 220 - 210 - 20);
		$("#widget_preview_container").find("div.main").css("width", 210 + 210);
		$("#widget_preview_container").find("#jsconsole_container").first().width($("#widget_preview_container").find("div.main").width()-1);
		$("#widget_preview_container").find('a[target="run"]').show();
	}
	
	function normal_view() {
		$("#widget_code_container").find("div.main").css("width", panel_width - 220 * 3);
		$("#widget_preview_container").find("div.main").css("width", 210);
		$("#widget_preview_container").find("#jsconsole_container").first().width($("#widget_preview_container").find("div.main").width()-1);
		$("#serive_list_container, #widget_list_container").find("div.main").show();
		$("#widget_preview_container").find('a[target="run"]').hide();
	}
	
	function init_view(widget, done) {
		
		var files = widget.get("files");

		//render Preview
		widget_preivew_panel.render(function(view){
			
			var container_ace_editor = new Editor.View({
				el: $(view.el).find("#container_container").first(),
				model: new Editor.Model({
					code: files.container,
					present: "javascript",
					height: panel_height - 55
				}),
			});
			
			var jsconsole = new JSConsole.View({
				el: $(view.el).find("#preivew_jsconsole_container").first(),
				model: new Editor.Model({
				}),
			});
			
			var auto_run = true;
			
			jsconsole.render(function(view){
				
				if(auto_run) {
					var preview_frame = document.getElementById("preview_frame");				
	
					var run_widget = {
							html: files.html,
							javascript: files.javascript,
							css: files.css,
							container: files.container
					};
					
					preview_frame.contentWindow.postMessage(run_widget, "*");
					auto_run = false;
				}
				
				$(view.el).find("#preview_frame").css("height", panel_height - 55 - 200);
			});
			
			var container_modal_data = {
					id: "container_link_modal",
					title: "Container Link", 
					inputs: [
					         {title: "URL", type: "text", id: "container_file_url", placeholder: "url of file"}
					         ],
					checklist: ["Load from this link every boot."],
					action: "Get Code"
			};
			
			var container_modal = new Modal.View({
				el: $("#container_modal_container"),
				model: new Modal.Model({
					modal: container_modal_data
				})
			});
			
			container_modal.render(function(view){
				$(view.el).find("label").first().width(110);
				$(view.el).find("input").first().width(300)
				.parent().css("margin-left", 130);
				$(view.el).find("label.checkbox").parent().css("margin-left", 130);
				$(view.el).find("div.control-group").css("margin-bottom", 0);
				$(view.el).find("a").first().click(function() {
					var url = $(view.el).find("input").first().val();
					application.load(url, function(content) {
						container_ace_editor.ace.setValue(content);
						$("#container_link_modal").modal("hide");
					});
				});
			});

			
			var operations_data = [{text: "Preview", target: "0"},
	                               {text: "Container", target: "1", dropdown: function() {
		           				    	$("#container_link_modal").modal({
		           							backdrop: true
		           						});
	           				    	}},
	                               {text: "Run", target: "run", style: "right"}];
			
			var operations = new Operations.View({
				el: $(view.el).find("#operations_container"),
				collection: new Operations.Collection(operations_data)
			});
			
			operations.render(function(view){
				
				var targets = $(view.el).find('a[target="0"], a[target="1"]');
				var tabs = $("#preivew_jsconsole_container, #container_container");
				
				targets.click(function(){
					targets.removeClass("actived");
					tabs.hide();
					$(this).addClass("actived");
					$(tabs[$(this).attr("target")]).show();
					
					container_ace_editor.ace.resize();
				});
				
				targets.first().addClass("actived");
				tabs.first().show();
				$("#widget_preview_container").find('a[target="run"]').hide();
				
			});
			
			
			//render Codes
			widget_code_panel.render(function(view){
				
				$(view.el).find("a.caret").first().click(function() {
					$("#github_modal").modal({
						backdrop: true
					});
				});
				
				$(view.el).find("div.content").first().after('<div id="ref_container"></div>');
				
				//render editors
				var html_editor = new Editor.View({
					el: $(view.el).find("#html_editor_container").first(),
					model: new Editor.Model({
						code: files.html,
						present: "html",
						height: panel_height - 80
					}),
				});
				
				var javascript_editor = new Editor.View({
					el: $(view.el).find("#javascript_editor_container").first(),
					model: new Editor.Model({
						code: files.javascript,
						present: "javascript",
						height: panel_height - 80
					}),
				});
				
				var css_editor = new Editor.View({
					el: $(view.el).find("#css_editor_container").first(),
					model: new Editor.Model({
						code: files.css,
						present: "css",
						height: panel_height - 80
					}),
				});
				
				var ref_data = {
						html: [
						       {name: "Bootstrap", href: "http://twitter.github.com/bootstrap/base-css.html"}
						], 
						
						javascript: [
						       {name: "Undersocre", href: "http://underscorejs.org/"},
						       {name: "Bankbone", href: "http://backbonejs.org/"}
						], 
						
						css: [
						       {name: "W3Schools", href: "http://www.w3schools.com/css/default.asp"}
						]
				};
				
				var ref = new Ref.View({
					el: $(view.el).find("#ref_container"),
					model: new Ref.Model(ref_data)
				});
				
				var html_modal_data = {
						id: "html_link_modal",
						title: "HTML Link", 
						inputs: [
						         {title: "URL", type: "text", id: "html_file_url", placeholder: "url of file"}
						         ],
						checklist: ["Load from this link every boot."],
						action: "Get Code"
				};
				
				var html_modal = new Modal.View({
					el: $("#html_modal_container"),
					model: new Modal.Model({
						modal: html_modal_data
					})
				});
				
				html_modal.render(function(view){
					$(view.el).find("label.control-label").first().width(110);
					$(view.el).find("input").first().width(300)
					.parent().css("margin-left", 130);
					$(view.el).find("label.checkbox").parent().css("margin-left", 130);
					$(view.el).find("div.control-group").css("margin-bottom", 0);
					$(view.el).find("a").first().click(function() {
						var url = $(view.el).find("input").first().val();
						application.load(url, function(content) {
							html_editor.ace.setValue(content);
							$("#html_link_modal").modal("hide");
						});
					});
				});
				
				var javascript_modal_data = {
						id: "javascript_link_modal",
						title: "JavaScript Link", 
						inputs: [
						         {title: "URL", type: "text", id: "javascript_file_url", placeholder: "url of file"}
						         ],
						checklist: ["Load from this link every boot."],
						action: "Get Code"
				};
				
				var javascript_modal = new Modal.View({
					el: $("#javascript_modal_container"),
					model: new Modal.Model({
						modal: javascript_modal_data
					})
				});
				
				javascript_modal.render(function(view){
					$(view.el).find("label").first().width(110);
					$(view.el).find("input").first().width(300)
					.parent().css("margin-left", 130);
					$(view.el).find("label.checkbox").parent().css("margin-left", 130);
					$(view.el).find("div.control-group").css("margin-bottom", 0);
					$(view.el).find("a").first().click(function() {
						var url = $(view.el).find("input").first().val();
						application.load(url, function(content) {
							javascript_editor.ace.setValue(content);
							$("#javascript_link_modal").modal("hide");
						});
					});
				});
				
				var css_modal_data = {
						id: "css_link_modal",
						title: "CSS Link", 
						inputs: [
						         {title: "URL", type: "text", id: "css_file_url", placeholder: "url of file"}
						         ],
						checklist: ["Load from this link every boot."],
						action: "Get Code"
				};
				
				var css_modal = new Modal.View({
					el: $("#css_modal_container"),
					model: new Modal.Model({
						modal: css_modal_data
					})
				});
				
				css_modal.render(function(view){
					$(view.el).find("label").first().width(110);
					$(view.el).find("input").first().width(300)
					.parent().css("margin-left", 130);
					$(view.el).find("label.checkbox").parent().css("margin-left", 130);
					$(view.el).find("div.control-group").css("margin-bottom", 0);
					$(view.el).find("a").first().click(function() {
						var url = $(view.el).find("input").first().val();
						application.load(url, function(content) {
							css_editor.ace.setValue(content);
							$("#css_link_modal").modal("hide");
						});
					});
				});
				
				var save_modal_data = {
						id: "save_options_modal",
						title: "Save Options", 
						checklist: ["Save to Github.", "Save to School Service."],
						action: "Done"
				};
				
				var save_modal = new Modal.View({
					el: $("#save_modal_container"),
					model: new Modal.Model({
						modal: save_modal_data
					})
				});
				
				save_modal.render(function(view){
					
				});
				
				var operations_data = [
				    {text: "HTML", target: "#html_editor_container", 
				    	event: {on: "click", fun: function() {
				    		console.log("click HTML");
				    	
				    }}, dropdown: function() {
				    	$("#html_link_modal").modal({
							backdrop: true
						});
				    	
				    }},
		            {text: "JavaScript", target: "#javascript_editor_container", 
				    	event: {on: "click", fun: function() {
				    		console.log("click JavaScript");
				    	
				    }}, dropdown: function() {
				    	$("#javascript_link_modal").modal({
							backdrop: true
						});
				    }},
		            {text: "CSS", target: "#css_editor_container", 
				    	event: {on: "click", fun: function() {
				    		console.log("click CSS");
				    	
				    }}, dropdown: function() {
				    	$("#css_link_modal").modal({
							backdrop: true
						});
				    }},
		            {text: "Save", target: "save", style: "right", 
				    	event: {on: "click", fun: function() {
				    		console.log("click Save");
				    	
				    }}, dropdown: function() {
				    	$("#save_options_modal").modal({
							backdrop: true
						});
				    }}
				];
				
				var operations = new Operations.View({
					el: $(view.el).find("#operations_container"),
					collection: new Operations.Collection(operations_data)
				});
				
				ref.render(function(ref_view){
					
					//render the operations on Codes panel
					operations.render(function(view){
						
						var targets = $(view.el).find('a[target="#html_editor_container"], a[target="#javascript_editor_container"], a[target="#css_editor_container"]');
						var refs = $(ref_view.el).find("ul");
						var editors = $("#html_editor_container, #javascript_editor_container, #css_editor_container");
						
						//switch codes' view
						targets.click(function(){

							editors.hide();
							$($(this).attr("target")).show();
							targets.removeClass("actived");
							$(this).addClass("actived");
							
							refs.hide();
							
							$(refs[$(this).parent().index()]).css("display", "inline-block");
							
							
							html_editor.ace.resize();
							javascript_editor.ace.resize();
							css_editor.ace.resize();
						});
						
						//display the init view
						$("#html_ace_editor").show();
						$(refs[0]).css("display", "inline-block");
						targets.first().addClass("actived");
						
						
						$("#widget_list_container a.sidebar").unbind("click").click(function(){
							switch_views(function(){
							});
						});

						//save button event
						if(widget.isNew()) {
							var modal_data = {
									id: "new_widget_modal",
									title: "New Widget", 
									inputs: [
									         {title: "Widget Name", type: "text", id: "widgetname", placeholder: "widget's name"}
									         ],
//									checklist: ["Apply Backbone Template", "Apply AngularJS Template"],
									action: "Create"
							};
							var modal = new Modal.View({
								el: $("#new_widget_modal_container"),
								model: new Modal.Model({
									modal: modal_data
								})
							});
							
							
							modal.render(function(view){
								
								$(view.el).find("a").click(function(){
									
									var creator_name = "test-user-1";
									var widget_name = $(modal.el).find('input[type="text"]').first().val();
									
									var files = JSON.stringify({
										html: html_editor.ace.getValue(),
						    			javascript: javascript_editor.ace.getValue(),
						    			css: css_editor.ace.getValue(),
						    			container: container_ace_editor.ace.getValue(),
						        	});
									
									var service_name = $(serview_list_panel.el).find("a.actived").first().attr("target");
									
									widget.set("creator_name", creator_name);
									widget.set("widget_name", widget_name);
									widget.set("files", files);
									widget.set("service_name", service_name);
									
									widget.save(function() {
										jsconsole.logging("saved", "success");
									});
									
									$("#new_widget_modal").modal('hide');
								});
							});
							
							$(view.el).find('a[target="save"]').click(function(){
								$("#new_widget_modal").modal({
									backdrop: true
								});
							});
						}else {
							
							$(view.el).find('a[target="save"]').click(function(){
								
								var files = JSON.stringify({
									html: html_editor.ace.getValue(),
					    			javascript: javascript_editor.ace.getValue(),
					    			css: css_editor.ace.getValue(),
					    			container: container_ace_editor.ace.getValue(),
					        	});
								
								widget.set("files", files);
								
								widget.save(function() {
									jsconsole.logging("saved", "success");
								});
							});
						}
						
						// run button event
						$('#widget_preview_container div.operations a[target="run"]').click(function(){
							
							var preview_frame = document.getElementById("preview_frame").contentWindow;
							
							var run_widget = {
								html: html_editor.ace.getValue(),
								javascript: javascript_editor.ace.getValue(),
								css: css_editor.ace.getValue(),
								container: container_ace_editor.ace.getValue()
							};
							preview_frame.postMessage(run_widget, "*");
						});
					});
				});										
			});
		});
		
		if(_.isFunction(done)) {
			done();
		}
	}
	
	application.fetchTemplate("modules/github/github.html", function(template){
		
		$("#settings_modal_container").html(application.compiles(template, {}));
		
		$("#settings_modal_container").find("a").first().click(function() {
			
			Persistence.github_options.repowner = $("#settings_modal_container").find("#repoowner").val();
			Persistence.github_options.reponame = $("#settings_modal_container").find("#reponame").val();
			Persistence.github_options.htmlpath = $("#settings_modal_container").find("#htmlfile").val();
			Persistence.github_options.javascriptpath = $("#settings_modal_container").find("#javascriptfile").val();
			Persistence.github_options.csspath = $("#settings_modal_container").find("#cssfile").val();
			Persistence.github_options.containerpath = $("#settings_modal_container").find("#containerfile").val();
			
			var widget = new Widget.Model({
				creator_name: Persistence.github_options.repowner,
				widget_name: Persistence.github_options.reponame,
			});
			
			widget.storage = new Persistence.github_storage(Persistence.github_options);
			
			widget.fetch(function() {
				init_view(widget, function() {
//					switch_views();
					developer_view();
				});
				
			});
			
			$("#github_modal").modal('hide');
			
		});
	});
	
	
//	var settings_modal_data = {
//			id: "setting_modal",
//			title: "Github Settings", 
//			inputs: [
//			         {title: "Username", type: "text", id: "github_username", placeholder: "username"},
//			         {title: "Password", type: "password", id: "github_password", placeholder: "password"},
//			         {title: "Repository", type: "text", id: "github_reponame", placeholder: "reponame"}
//			         ],
//			checklist: ["Push to Github when click Save"],
//			action: "Close"
//	};
//	
//	var settings_modal = new Modal.View({
//		el: $("#settings_modal_container"),
//		model: new Modal.Model({
//			modal: settings_modal_data
//		})
//	});
//	
//	var save_option = false;
//	
//	settings_modal.render(function(view) {
//		
//		var checkbox = $(view.el).find("input[type=checkbox]").first();
//		
//		$("#header_container a.settings").click(function() {
//			$("#setting_modal").modal({
//				backdrop: true
//			});
//		});
//		
//		$(view.el).find("a").click(function() {
//			
//			Persistence.github_options.username = $("#github_username").val();
//			Persistence.github_options.password = $("#github_password").val();
//			Persistence.github_options.reponame = $("#github_reponame").val();
//			
//			save_option = checkbox.is(':checked');
//			
//			var widget = new Widget.Model({
//				creator_name: Persistence.github_options.username,
//				widget_name: Persistence.github_options.reponame,
//			});
//			
//			if(save_option) {
//				console.log("github");
//				widget.storage = new Persistence.github_storage(Persistence.github_options);
//			}else {
//				widget.storage = new Persistence.remote_storage();
//			}
//			
//			widget.fetch(function() {
//				init_view(widget);
//			});
//			
//			$("#setting_modal").modal('hide');
//		});
//	});
	
});


