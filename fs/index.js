const fs = require( 'fs' );
const http = require( 'http' );
const https = require( 'https' );
const { resolve, dirname } = require( 'path' );
const { promisify } = require( 'util' );

const mkdirp = require( 'mkdirp' );

/**
 * List the files in a directory, either as a list of file and subdir names or
 * a list of absolute file system paths.
 *
 * @param {string}  inputDir        The file system path to the directory to read.
 * @param {object}  [opts]          Options hash.
 * @param {boolean} [opts.absolute] Whether to return absolute file system paths.
 * @returns {Promise} A promise to an array of file system path strings.
 */
const ls = async ( inputDir, opts = {} ) => {
	const absolute = opts.absolute || false;
	const fileList = await promisify( fs.readdir )( inputDir );
	if ( absolute ) {
		return fileList.map( ( fileName ) => resolve( inputDir, fileName ) );
	}
	return fileList;
};

/**
 * Ensure a path exists on disk.
 *
 * @param {string} path An absolute file system path
 * @returns Promise
 */
const ensureExists = ( path ) => new Promise( ( resolve, reject ) => {
	mkdirp( path, ( err ) => {
		if ( err ) {
			reject( err );
		} else {
			resolve();
		}
	} );
} );

/**
 * Ensure a file exists on disk.
 *
 * @param {string} path An absolute file system path
 * @param filePath
 * @returns Promise
 */
const fileExists = ( filePath ) => new Promise( ( resolve, reject ) => {
	fs.stat( filePath, ( err ) => {
		resolve( ! err );
	} );
} );

/**
 * Read a file on disk and return its contents as a string.
 *
 * @param {string} filePath Absolute file system path for the file to read.
 */
const readFile = ( filePath ) => {
	return promisify( fs.readFile )( filePath ).then( ( contents ) => contents.toString() );
};

/**
 * Read a file on disk and parse its contents as JSON.
 *
 * @param {string} filePath Absolute file system path for the file to load.
 */
const readJSON = ( filePath ) => readFile( filePath ).then( ( contents ) => {
	return JSON.parse( contents );
} );

/**
 * Write string content to a file on disk.
 *
 * @param {string} filePath Absolute file system path for the file to write.
 * @param {string} contents Content to write to the file.
 */
const writeFile = ( filePath, contents ) => {
	return promisify( fs.writeFile )( filePath, contents );
};

/**
 * Write a JS object to a file on disk as stringified JSON.
 *
 * @param {string} filePath Absolute file system path for the JSON file to write.
 * @param {string} contents Object to stringify as JSON and write to the file.
 */
const writeJSON = ( filePath, contents ) => {
	const jsonContents = JSON.stringify( contents );
	return writeFile( filePath, jsonContents );
};

/**
 * Download a remote file to the local filesystem.
 *
 * @param {string} filePath An absolute filesystem path to which to save the file.
 * @param {string} uri      A remote file URI.
 * @returns Promise
 */
const download = async ( filePath, uri ) => {
	const outputDir = dirname( filePath );

	// Don't download to a non-existent directory.
	await ensureExists( outputDir );

	const writeToDisk = fs.createWriteStream( filePath );

	// Download the file to disk, contextually selecting HTTP or HTTPS.
	return new Promise( ( resolve, reject ) => {
		( uri.match( /^https/ ) ? https : http )
			.get( uri, ( response ) => response.pipe( writeToDisk )
				.on( 'finish', resolve )
				.on( 'error', reject )
			)
			.on( 'error', reject );
	} );
};

module.exports = {
	download,
	ensureExists,
	fileExists,
	ls,
	readFile,
	readJSON,
	writeFile,
	writeJSON,
};
