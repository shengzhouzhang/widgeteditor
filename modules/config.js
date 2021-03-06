/**
 * 
 * This configuration file for require.js
 * 
 * @author Steven Zhang
 * @version 1.0 February 24, 2013.
 */
require.config({
  // Initialize the application with the main application file
  deps: ["main"],

  paths: {
	  
    // Libraries
    jquery: "../libs/jquery",
    underscore: "../libs/underscore-min",
    backbone: "../libs/backbone-min",
    bootstrap: "../libs/bootstrap/js/bootstrap.min",
    base64: "../libs/github/base64",
    
    //Modules
    sidepanel: "sidepanel/sidepanel",
    editor: "editor/editor",
    jsconsole: "jsconsole/jsconsole",
    list: "list/list",
    operations: "operations/operations",
    ref: "ref/ref",
    widget: "widget/widget",
    configuration: "configuration/configurations",
    modal: "modal/modal",
    persistence: "persistence_api/persistence_api",
    github: "github/github",
    
    
    // Plugins
    ace: "../libs/ace/ace",

    // Shim Plugin
    use: "../libs/use",
    
    //config
    rest: "rest"
  },
  
  shim: {
	  'bootstrap': {
		  deps: ["jquery"],
		  exports: '$'
	  }
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    }
  }
});
