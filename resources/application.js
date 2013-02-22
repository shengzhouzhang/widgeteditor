(function(){
	
	window.application = {};
	
	application.fetchTemplate = function(path, done) {
		var JST = window.JST = window.JST || {};
	      var def = new $.Deferred();
	      
	      if (JST["example-widget-template"]) {
	        if (_.isFunction(done)) {
	          done(JST["example-widget-template"]);
	        }

	        return def.resolve(JST[path]);
	      }

	      // Should be an instant synchronous way of getting the template, if it
	      // exists in the JST object.
	      if (JST[path]) {
	        if (_.isFunction(done)) {
	          done(JST[path]);
	        }

	        return def.resolve(JST[path]);
	      }

	      // Fetch it asynchronously if not available from JST, ensure that
	      // template requests are never cached and prevent global ajax event
	      // handlers from firing.
	      $.ajax({
	        url: path,
	        type: "get",
	        dataType: "text",
	        cache: false,
	        global: false,

	        success: function(contents) {
	          JST[path] = contents;

	          // Set the global JST cache and return the template
	          if (_.isFunction(done)) {
	            done(JST[path]);
	          }

	          // Resolve the template deferred
	          def.resolve(JST[path]);
	        }
	      });

	      // Ensure a normalized return value (Promise)
	      return def.promise();
	};
	
	application.compiles = function(template, data) {
		return _.template(template, data);
	};

    
    //debugger
    application.debugger = {};
    
    application.debugger.listener = (function() {
    	
    	var receiveMessage = function(event) {
    		var html = event.data.html;
    		var javascript = event.data.javascript;
    		var css = event.data.css;
    		var container = event.data.container;

    		try {
    			var JST = window.JST = window.JST || {};
        		JST["example-widget-template"] = html;
    		}catch(err) {
    			application.debugger.post({content: "HTML: " + err.message, style: "error"});
    		}
    		
    		try {
    			window.eval(javascript);
    		}catch(err) {
    			application.debugger.post({content: "JavaScript: " + err.message, style: "error"});
    		}
    		
    		try {
    			window.eval(container);
    		}catch(err) {
    			application.debugger.post({content: "Container: " + err.message, style: "error"});
    		}
    	};
    	
    	window.addEventListener("message", receiveMessage, false);
    })();
    
    application.debugger.run = function(path) {
    	
    };
    
    application.debugger.post = function(message) {
    	parent.postMessage(message, "*"); 
    };
    
    window.console.log = function(message) {
    	application.debugger.post({content: message, style: "success"}, "*"); 
    };
    
    window.onerror = function(msg, url, line) {
    	application.debugger.post({content: msg, style: "error", line: line, url: url});
    	return true;
  	};
  	
  	$(document).unbind("ready").ready(function() {
  		application.debugger.post({content: "previewready", type: "ready"});
  	});
    
})();