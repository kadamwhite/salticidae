const fs = require( 'fs' );
const pify = require( 'pify' );
const { resolve } = require( 'path' );
const { debug, error } = require( '../log' );

/**
 * List the files in a directory, either as a list of file and subdir names or
 * a list of absolute file system paths.
 *
 * @param {String}  inputDir        The file system path to the directory to read.
 * @param {Object}  [opts]          Options hash.
 * @param {Boolean} [opts.absolute] Whether to return absolute file system paths.
 * @returns Promise A promise to an array of file system path strings.
 */
const ls = async ( inputDir, opts = {} ) => {
	debug( `salticidae.fs.ls: listing files in ${ inputDir }` );
	const absolute = opts.absolute || false;
	const fileList = await pify( fs.readdir )( inputDir );
	if ( absolute ) {
		return fileList.map( fileName => resolve( inputDir, fileName ) );
	}
	return fileList;
};

/**
 * Read a file on disk and return its contents as a string.
 *
 * @param {String} filePath Absolute file system path for the file to read.
 */
const read = filePath => {
	debug( `salticidae.fs.read: reading ${ filePath }` );
	return pify( fs.readFile )( filePath ).then( contents => contents.toString() );
};

/**
 * Read a file on disk and parse its contents as JSON.
 * @param {String} filePath Absolute file system path for the file to load.
 */
const readJSON = filePath => read( filePath ).then( contents => {
	debug( `salticidae.fs.readJSON: parsing ${ filePath } as JSON` );
	return JSON.parse( contents );
} );

const throwOrResolve = ( resolve, reject, err, result ) => {
	if ( err ) {
		return reject( err );
	}
	resolve( result );
};

/**
 * Write string content to a file on disk.
 *
 * @param {String} filePath Absolute file system path for the file to write.
 * @param {String} contents Content to write to the file.
 */
const write = ( filePath, contents ) => {
	debug( `salticidae.fs.write: writing ${ contents.length } characters to ${ filePath }` );
	return pify( fs.writeFile )( filePath, contents );
};

/**
 * Write a JS object to a file on disk as stringified JSON.
 *
 * @param {String} filePath Absolute file system path for the JSON file to write.
 * @param {String} contents Object to stringify as JSON and write to the file.
 */
const writeJSON = ( filePath, contents ) => {
	debug( `salticidae.fs.writeJSON: writing JSON data to ${ filePath }` );
	const jsonContents = JSON.stringify( contents );
	return write( filePath, jsonContents );
};

module.exports = {
	ls,
	read,
	readJSON,
	write,
	writeJSON,
};
