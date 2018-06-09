'use strict';

	var pData = {
		general: {},
		parameters: [],
		paths: [],
		status_codes: [],
		errors: []
	};

	var errors = {
		general: [],
		parameters: [],
		paths: [],
		status_codes: [],
		errors: []
	};

	var jsdata = '';

	var naming = 'lowerCamel';


	/**
	* @description gets the properties of 'obj', with a name prefix of 'prefix'
	* @param {string} prefix - the name to prefix to any properties found (for recursion)
	* @param {string} obj - the starting object within the file to start searching
	*/
	var getProps = function(prefix, obj) {
		var values = [];

		/**
		* loop through all the keys extracted from the object
		*/
		Object.keys(obj).forEach(function(key, index) {
			var type = 'object', desc = '';
			
			var names = [];
			if (prefix) {
				names.push(prefix);
			}
			names.push(key);

			if (obj[key].type) {
				type = obj[key].type;
			}

			/**
			* if there is an 'items' object, then look in there for either
			* a '$ref' to other object, or to get the 'type' of the property
			* If no 'items' object, then check if there is a '$ref' or 'type'
			*/
			if (obj[key].hasOwnProperty('items')) {

				if (obj[key].items.hasOwnProperty('$ref')) {
						var v = obj[key].items['$ref'];
						getProps(names.join('.'), jsdata.schemas[v].properties).forEach(function(kk, ii) {
							names.push(kk);
							values.push(kk);
						});
				} else if (obj[key].items.hasOwnProperty('type')) {
					values.push(names.join('.') + ',' + obj[key].items.type);
				}
			} else if (obj[key].hasOwnProperty('$ref')) {
				var v = obj[key]['$ref'];
				getProps(names.join('.'), jsdata.schemas[v].properties).forEach(function(kk, ii) {
					// names.push(kk);

					names.push(kk);
					values.push(kk);
				});
			} else if (obj[key].hasOwnProperty('type')) {
					values.push(names.join('.') + ',' + obj[key].type);
			} else {

				values.push(names.join('.') + ',' + type);
			}
		
		});

		return values;
	}


	/**
	* @description retrieves the CSV file type based on the name embedded in the file name
	* @param {string} fname - the file name
	*/
	var getCsvFileType = function(fname) {
		var dash = (fname.lastIndexOf("-") - 1 >>> 0) + 2;
		var dot = (fname.lastIndexOf(".") - 1 >>> 0) + 1;
		var ftype = fname.slice(dash, dot);

		return ftype;
	}


	/**
	* @description Represents a book
	* @param {string} title - The title of the book
	* @param {string} author - The author of the book
	*/
	var createErrorObj = function(name, level, msg) {
		var obj = {};
		obj.name = name;
		obj.msg = msg;
		obj.level = level;

		return obj;
	}

	/**
	* @description checks the base path
	*/
	var checkBasePath = function() {
		var x = [];
		var msg = '';
		x.push(pData.general.basePath);
		checkPathStructure('basePath', x);

		if (! (pData.general.basePath.match(/v[0-9]/g) || []).length) {
			msg = "basePath should have version string (v[0-9], e.g. v1)";
			errors.paths.push(createErrorObj(pData.general.basePath, 'error', msg));
		}

		return;
	}

	/**
	* @description checks the words that make up a path
	* @param {array} paths - an array of paths
	*/
	var checkResources = function(paths) {
		paths.forEach(function(key, idx) {

			// remove first forward slashes for easier matching
			var nkeys = key.replace(/^[/]+|[/]$/, '').split('/');
			var k = nkeys[nkeys.length-1];
			var msg = '', level='';

			if (k.match(/create|make|delete|update|get|del|remove/i)) {
				msg = "resource must be a noun";
				errors.paths.push(createErrorObj(key, 'error', msg));
			}
			if (naming === 'lowerCamel') {
				if (/^[A-Z_-]+|[_-]+/.test(k)) {
					msg = "resource must be lowerCamel case";
					errors.paths.push(createErrorObj(key, 'error', msg));
				}
			} else if (naming === 'UpperCamel') {
				if (k.match(/^[a-z_-]+|[_-]+/)) {
					msg = "resource must be UpperCamel case";
					errors.paths.push(createErrorObj(key, 'error', msg));
				}
			} else if (naming === 'snake') {
				if (k.match(/[_]/) == false) {
					msg = "resource must be in snake_case";
					errors.paths.push(createErrorObj(key, 'warning', msg));
				}
			}
		});

		return;
	}

	/**
	* @description checks if the paths have the correct path separator
	* @param {string} name - name of the path (paths or basePath)
	* @param {array} paths - array of paths
	*/
	var checkPathStructure = function(name, paths) {
		
		// var allpaths = pData.paths.push(jsdata.basePath);

		paths.forEach(function(key, idx) {
			var msg = '';
			var stripped = key.replace(/\//g, '');

			if (key.match(/\/\//)) {
				msg = name + " can not have double forward slash";
				errors.paths.push(createErrorObj(key, 'error', msg));
			}
			// if (/\?|#|;|=|\s/i.test(key)) {
			if (stripped != encodeURIComponent(stripped)) {
				msg = name + " can not have reserved characters";
				errors.paths.push(createErrorObj(key, 'error', msg));
			}
			if (! (key.match(/\//g) || []).length) {
				msg = name + " should have at least one forward slash";
				errors.paths.push(createErrorObj(key, 'warning', msg));
			}
			if (key[0] != '/') {
				msg = name + " should have leading forward slash";
				errors.paths.push(createErrorObj(key, 'error', msg));
			}
			if (key[key.length-1] === '/') {
				msg = name + " should not have forward slash at end of path";
				errors.paths.push(createErrorObj(key, 'warning', msg));
			}
		});

		return;
	}
/**
* @description retrieves the errors for a specific type of check
* @param {string} type - paths, parameters, status_codes, errors
*/
var getErrors = function(type) {
	return errors[type];
}

/**
* @description retrieves the data for a specific type of check
* @param {string} type - paths, parameters, status_codes, errors
*/
var getData = function(type) {
	return pData[type];
}

/**
* @description clears all the data to start over
*/
var clearData = function() {
	pData = {
		general: {},
		parameters: [],
		paths: [],
		status_codes: [],
		errors: []
	};

	errors = {
		general: [],
		parameters: [],
		paths: [],
		status_codes: [],
		errors: []
	};

	jsdata = '';

	return;
}
	/**
	* @description load CSV files into internal data structure
	* @param {string} filenames - variable number of filenames
	*/
	var loadCsv = function(type, data) {
		
		var jsonArray = [];
		var dataArray = data.split('\n');
		var head = dataArray[0].split(',');
		dataArray.splice(1).forEach(function(line) {
			line.split(',').forEach(function(val, idx) {
				console.log(head[idx] + ' = ' +val);
			})
	 	})

	 	return;
	}

	/**
	* @description load JSON (Swagger/OpenAPI) file into internal data structure
	* @param {string} title - The title of the book
	* @param {string} author - The author of the book
	*/
	var loadJson = function(data) {
		var jsdata = JSON.parse(data);

		pData.general.basePath = jsdata.basePath;
		pData.general.host = jsdata.host;

		Object.keys(jsdata.paths).forEach(function(key, index) {
			pData.paths.push(key);
			console.log(key);
			getProps('', pData.paths[index]).forEach(function(key, idx) {
				// console.log(key);
			})
		});

		return;
	}


	// if( typeof exports !== 'undefined' ) {
	//     if( typeof module !== 'undefined' && module.exports ) {
	//       exports = module.exports = jsonic;
	//     }
	//     exports.jsonic = jsonic;
 //  	} else {
 //    	root.jsonic = jsonic;
 //  	}
