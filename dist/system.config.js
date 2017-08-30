(function (global) {
	"use strict";
	
	System.config({
      map: {
		 app: "js",
      },
		packages: {
			"app": { 
				main: "main.js",
				defaultExtension: "js" 
			}
		}
	});
})(this);