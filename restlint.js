
if (! process.argv[2]) {
	console.log('restlint <swagger-file>');
	console.log('      OR');
	console.log('restlint <csv-file-paths> <csv-file-params> <csv-file-status> <csv-file-errors>');
	return;
}

const fs = require('fs');
var wordNet = require( 'wordnet-magic' );

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
function getProps(prefix, obj) {
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
function getCsvFileType(fname) {
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
function createErrorObj(name, level, msg) {
	var obj = {};
	obj.name = name;
	obj.msg = msg;
	obj.level = level;

	return obj;
}

/**
* @description checks the base path
*/
function checkBasePath() {
	var x = [];
	x.push(pData.general.basePath);
	checkPathStructure('basePath', x);

	if (! (pData.general.basePath.match(/v[0-9]/g) || []).length) {
		msg = "basePath should have version string (v[0-9], e.g. v1)";
		errors.paths.push(createErrorObj(pData.general.basePath, 'error', msg));
	}
}

/**
* @description checks the words that make up a path
* @param {array} paths - an array of paths
*/
function checkResources(paths) {
	paths.forEach(function(key, idx) {
		if (/create|make|delete|update|get|del|remove/i.test(key)) {
			msg = "resource must be a noun";
			errors.paths.push(createErrorObj(key, 'error', msg));
		}
		if (naming === 'lowerCamel') {
			if (/^[/]{0,1}[A-Z_-]/.test(key)) {
				msg = "resource must be lowerCamel case";
				errors.paths.push(createErrorObj(key, 'error', msg));
			}
		} else if (naming === 'UpperCamel') {
			if (/^[/]{0,1}[a-z_-]/.test(key)) {
				msg = "resource must be UpperCamel case";
				errors.paths.push(createErrorObj(key, 'error', msg));
			}
		} else if (naming === 'snake') {
			if (/[_]/.test(key) == false) {
				msg = "resource must be in snake_case";
				errors.paths.push(createErrorObj(key, 'warning', msg));
			}
		}
	});
}

/**
* @description checks if the paths have the correct path separator
* @param {string} name - name of the path (paths or basePath)
* @param {array} paths - array of paths
*/
function checkPathStructure(name, paths) {
	
	// var allpaths = pData.paths.push(jsdata.basePath);

	paths.forEach(function(key, idx) {
		var stripped = key.replace(/\//g, '');

		if (/\/\//.test(key)) {
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
}

// loop over each of the files that were passed in and loads data
process.argv.splice(2).forEach(function(item, idx) {

	var filePath = __dirname + '/' + item;
	var ext = getExt(item);

	var data = fs.readFileSync(filePath, 'utf8');

	// parse based on input file type
	if (ext === 'csv') {
		var ftype = getCsvFileType(filePath);
		loadCsv(ftype, data);
	} else if (ext === 'json') {
		loadJson(data);
	}
});


//
// Start running the checks
//

checkPathStructure('paths', pData.paths);
checkResources(pData.paths);
checkBasePath();



errors.paths.forEach(function(key, idx) {

	console.log(key.level + ': ' + key.name + ' - ' + key.msg);
});

// var paths = jsdata.paths;
// var wordnet = new WordNet()

var wordNet = require( 'wordnet-magic' );

// var wn = wordNet( '/data', true );
var wn = wordNet( null, true );


// wn.isNoun( 'promise' ).then( console.log );


// async function f1() {
// 	let res = await wn.isNoun( 'promise' );
// 	return res;
// }

/**
* @description get a file names extension, from here: https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/12900504#12900504
* @param {string} fname - name of the file
*/
function getExt(fname) {
	return fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
}

var kiss = new wn.Word( 'kiss' );
kiss.getSynsets( function( err, data ) {
	// console.log( util.inspect( data, null, 3 ) );
	// console.log( data, null);
});

kiss.getSynsets()
.then(function(err,items) {
		console.log(items);
});