
if (! process.argv[2]) {
	console.log('restlint <swagger-file>');
	console.log('      OR');
	console.log('restlint <csv-file-paths> <csv-file-params> <csv-file-status> <csv-file-errors>');
	return;
}

const fs = require('fs');
var wordNet = require( 'wordnet-magic' );

var pData = {
	general: [],
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
function checkBasePath(base) {

}

/**
* @description Represents a book
* @param {string} title - The title of the book
* @param {string} author - The author of the book
*/
function checkPathsSeparator() {
	pData.paths.forEach(function(key, idx) {
		if (key[0] != '/') {
			var obj = {};
			obj.name = key;
			obj.msg = "paths should have leading slash";
			obj.level = 'warning';

			errors.paths.push(obj);
			path = '/' + key;
		}
	});
}

// loop over each of the files that were passed in
process.argv.splice(2).forEach(function(item, idx) {

	var filePath = __dirname + '/' + item;
	var ext = getExt(item);

	var data = fs.readFileSync(filePath, 'utf8');

	// parse based on input file type
	if (ext === 'csv') {

		var ftype = getCsvFileType(filePath);
		var jsonArray = [];
		var dataArray = data.split('\n');
		var head = dataArray[0].split(',');
		dataArray.splice(1).forEach(function(line) {
			line.split(',').forEach(function(val, idx) {
				console.log(head[idx] + ' = ' +val);
			})
	 	})

	} else if (ext === 'json') {
		
		var jsdata = JSON.parse(data);

		Object.keys(jsdata.paths).forEach(function(key, index) {
			pData.paths.push(key);
		});

		console.log(pData.paths.toString());
	}
});


//
// Start running the checks
//

checkPathsSeparator();

console.log(errors.toString());

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
.then(
	console.log
	);