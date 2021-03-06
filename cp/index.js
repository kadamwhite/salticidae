const { debug } = require( '../log' );
const child_process = require( 'child_process' );

/**
 * Execute an arbitrary string command.
 *
 * @param {String} command A bash command string, including arguments.
 * @returns {Promise} A promise which will resolve when the executed command exits.
 */
const exec = command => {
	debug( command );
	return new Promise( ( resolve, reject ) => {
		child_process.exec( command, error => {
			if ( error ) {
				return reject( error );
			}
			resolve();
		} );
	} );
};

/**
 * Execute a command as a spawned process.
 *
 * @param {String}   command A bash command string, excluding arguments.
 * @param {String[]} args    An array of argument strings for the provided command.
 */
const spawn = ( command, args ) => {
	debug( `${ command } ${ args.join( ' ' ) }` );
	return new Promise( ( resolve, reject ) => {
		const { spawn } = require( 'child_process' );
		const spawnedProcess = spawn( command, args, {
			stdio: 'inherit',
		} );

		spawnedProcess.on( 'error', err => reject( err ) );

		spawnedProcess.on( 'close', ( code, signal ) => {
			debug( `${ command } exited with${
				code ? ` code ${ code }` : ''
			}${
				signal ? ` signal ${ signal }` : ''
			}` );
			if ( code ) {
				reject();
				return;
			}
			resolve();
		} );
	} );
}

module.exports = {
	exec,
	spawn,
};
