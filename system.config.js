(function (global) {
	"use strict";
	
	System.config({
		transpiler: 'Babel',
      // or traceurOptions or typescriptOptions
      babelOptions: {
        plugins: ["transform-es2015-modules-systemjs"],
        presets: ['es2015']
      },
      map: {
		 app: "build",
        Babel: './node_modules/babel-standalone/babel.js'
      },
		packages: {
			"app": { 
				main: "main.js",
				defaultExtension: "js" 
			}
		}
	});
})(this);