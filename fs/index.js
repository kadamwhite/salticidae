const fs = require( 'fs' );
const http = require( 'http' );
const https = require( 'https' );
const pify = require( 'pify' );
const mkdirp = require( 'mkdirp' );
const { resolve, dirname } = require( 'path' );
const { debug } = require( '../log' );

/**
 * List the files in a directory, either as a list of file and subdir names or
 * a list of absolute file system paths.
 *
 * @param {String}  inputDir        The file system path to the directory to read.
 * @param {Object}  [opts]          Options hash.
 * @param {Boolean} [opts.absolute] Whether to return absolute file system paths.
 * @returns {Promise} A promise to an array of file system path strings.
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
 * Ensure a path exists on disk.
 *
 * @param {String} path An absolute file system path
 * @return Promise
 */
const ensureExists = path => new Promise( ( resolve, reject ) => {
	debug( `Ensuring path "${ path }" exists` );
	mkdirp( path, err => {
		if ( err ) {
			reject( err );
		} else {
			resolve();
		}
	} );
} );

/**
 * Read a file on disk and return its contents as a string.
 *
 * @param {String} filePath Absolute file system path for the file to read.
 */
const readFile = filePath => {
	debug( `salticidae.fs.read: reading ${ filePath }` );
	return pify( fs.readFile )( filePath ).then( contents => contents.toString() );
};

/**
 * Read a file on disk and parse its contents as JSON.
 * @param {String} filePath Absolute file system path for the file to load.
 */
const readJSON = filePath => readFile( filePath ).then( contents => {
	debug( `salticidae.fs.readJSON: parsing ${ filePath } as JSON` );
	return JSON.parse( contents );
} );

/**
 * Write string content to a file on disk.
 *
 * @param {String} filePath Absolute file system path for the file to write.
 * @param {String} contents Content to write to the file.
 */
const writeFile = ( filePath, contents ) => {
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
	return writeFile( filePath, jsonContents );
};

/**
 * Download a remote file to the local filesystem.
 *
 * @param {String} filePath An absolute filesystem path to which to save the file.
 * @param {String} uri      A remote file URI.
 * @return Promise
 */
const download = async ( filePath, uri ) => {
	debug( `Downloading ${ uri } to ${ filePath }` );

	const outputDir = dirname( filePath );

	// Don't download to a non-existent directory.
	await ensureExists( outputDir );

	const writeToDisk = fs.createWriteStream( filePath );

	// Download the file to disk, contextually selecting HTTP or HTTPS.
	return new Promise( ( resolve, reject ) => {
		( uri.match( /^https/ ) ? https : http )
			.get( uri, response => response.pipe( writeToDisk )
				.on( 'finish', resolve )
				.on( 'error', reject )
			)
			.on( 'error', reject );
	} );
};

module.exports = {
	download,
	ensureExists,
	ls,
	readFile,
	readJSON,
	writeFile,
	writeJSON,
};
