const fs = require( 'fs' );
const pify = require( 'pify' );
const { resolve } = require( 'path' );

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
	const absolute = opts.absolute || false;
	const fileList = await pify( fs.readdir )( inputDir );
	if ( absolute ) {
		return fileList.map( fileName => resolve( inputDir, fileName ) );
	}
	return fileList;
};

const throwOrResolve = ( resolve, reject, err, result ) => {
	if ( err ) {
		return reject( err );
	}
	resolve( result );
};

function read( file ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( file, ( err, contents ) => {
			const str = ! err && contents.toString();
			return throwOrResolve( resolve, reject, err, str );
		} );
	} );
}

function readJSON( file ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( file, ( err, contents ) => {
			const json = ! err && JSON.parse( contents.toString() );
			return throwOrResolve( resolve, reject, err, json );
		} );
	} );
}

function write( file, contents ) {
	return new Promise( ( resolve, reject ) => {
		fs.writeFile( file, contents, err => throwOrResolve( resolve, reject, err, contents ) );
	} );
}

function writeJSON( file, contents ) {
	return new Promise( ( resolve, reject ) => {
		const json = JSON.stringify( contents );
		fs.writeFile( file, json, err => throwOrResolve( resolve, reject, err, json ) );
	} );
}

module.exports = {
	ls,
	read,
	readJSON,
	write,
	writeJSON,
};
