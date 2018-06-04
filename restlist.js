/**
*
* @description script to read in a google discovery JSON file, and flatten out the properties into CSV
* @param {string} arg1 - for command line argument is the name of the JSON file to read
*/

var fs = require('fs');
var WordNet = require('node-wordnet')

if (! process.argv[2]) {
	console.log('Need file');
	return;
}

var data = fs.readFileSync(__dirname + '/' + process.argv[2]);
var jsdata = JSON.parse(data);
var paths = jsdata.paths;
var wordnet = new WordNet()

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

var checkPaths = function(host, base, obj) {
	Object.keys(obj).forEach(function(key, index) {
		console.log('KEY: ' + key);
		var path = key;
		if (key[0] != '/') {
			console.log('Error: path should have leading path separator (/): ' + key);
			path = '/' + key;
		}
		path.split('/').slice(1).forEach(function(x) {
			console.log('WORD: ' + x);
			if (/created|delete|update|get|del/i.test(x)) {
				console.log('Error: Contains verb in resource name: ' + key);
			} else {
				var verbFlag = false;
				var nonVerbFlag = false;
				wordnet.lookup(x, function(results) {
					if (results.length === 0) {
						console.log('NOT A WORD |' + x + '|');
					}
					results.forEach(function(result) {
						// console.log(x + ' ' + result.pos);
						if (result.pos === 'v') {
							// console.log('Warning: Contains verb in resource name: ' + key);
							verbFlag = true;
						} else if (/s|a|n|r/.test(result.pos)) {
							// console.log('Warning: Contains verb in resource name: ' + key);
							nonVerbFlag = true;
						}
					});
				});
				if (verbFlag && !nonVerbFlag) {
					console.log('Warning: Word in resource name could be a verb: ' + x + ' in ' + key);
				}
			};
		})
	}); 
}
console.log('Swagger version: ' + jsdata.swagger);
console.log('base: ' + jsdata.basePath);
console.log('host: ' + jsdata.host);
console.log(checkPaths(jsdata.host, jsdata.basePath, paths));


wordnet.lookup('createEntity', function(results) {
	console.log(results);
    results.forEach(function(result) {
        console.log('------------------------------------');
        console.log(result.synsetOffset);
        console.log(result.pos);
        console.log(result.lemma);
        console.log(result.synonyms);
        console.log(result.pos);
        console.log(result.gloss);
    });
});