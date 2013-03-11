/**
 * 
 * This is the module for editor component.
 * 
 * @author Steven Zhang
 * @version 1.0 February 24, 2013.
 */
define([
  "application",
  "jquery",
  "use!backbone",
  "ace"
],

function(application, $, Backbone) {
	
	var Editor = application.module();
	
	Editor.Model = Backbone.Model.extend({

		defaults: {
			code: null,
			present: null,
			theme: "ace/theme/chrome",
			show_print_margin: false,
			use_worker: false,
			undo_select: false,
			soft_tabs: false,
			animated_scroll: false,
			h_scroll_visible: false,
			position: "relative",
			width: null,
			height: null,
			auto_height: true
		}
	
	});
	
	Editor.View = Backbone.View.extend({
		
		initialize: function() {
			this.render();
		},

		render: function() {
			
			var name = this.$el.attr("id");
			
			if(!this.$el.is("div")){
				console.log("container must be a div !!!");
				return;
			}
			
				
			var style = {
					'position': this.model.get("position"), 
					'height': this.model.get("height")
			};
				
			if (typeof name == 'undefined' || name == false){
				console.log("container must has id attribute !!!");
				return;
			}
			
//			var script = this.model.get("script");
//			
//			if (typeof script !== 'undefined'){
//				script = script.replace(/</g, '&lt;');
//			}
			

			this.$el.css(style);
			
			var ace_editor = ace.edit(name);
			ace_editor.setTheme(this.model.get("theme"));
			ace_editor.getSession().setMode("ace/mode/" + this.model.get("present"));
			ace_editor.setValue(this.model.get("code"));
			ace_editor.setShowPrintMargin(this.model.get("show_print_margin"));
			ace_editor.session.setUseWorker(this.model.get("use_worker"));
			ace_editor.session.setUndoSelect(this.model.get("undo_select"));
			ace_editor.session.setUseSoftTabs(this.model.get("soft_tabs"));
			ace_editor.renderer.setAnimatedScroll(this.model.get("animated_scroll"));
			ace_editor.renderer.setHScrollBarAlwaysVisible(this.model.get("animated_scroll"));
			ace_editor.setHighlightActiveLine(false);
			
			this.ace = ace_editor;
			
			this.ace.resize();
		},
		
		save: function() {
			this.model.set(this.model.get("present"), this.ace_editor.getValue());
		}
		
	});
	
	return Editor;

});