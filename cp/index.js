const child_process = require( 'child_process' );

/**
 * Execute an arbitrary string command.
 *
 * @param {string} command A bash command string, including arguments.
 * @returns {Promise} A promise which will resolve when the executed command exits.
 */
const exec = ( command ) => {
	return new Promise( ( resolve, reject ) => {
		child_process.exec( command, ( error ) => {
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
 * @param {string}   command A bash command string, excluding arguments.
 * @param {string[]} args    An array of argument strings for the provided command.
 * @returns {Promise<string[]>} Array of file and directory names
 */
const spawn = ( command, args ) => {
	return new Promise( ( resolve, reject ) => {
		const { spawn } = require( 'child_process' );
		const spawnedProcess = spawn( command, args, {
			stdio: 'inherit',
		} );

		spawnedProcess.on( 'error', ( err ) => reject( err ) );

		spawnedProcess.on( 'close', ( code, signal ) => {
			if ( code ) {
				reject();
				return;
			}
			resolve();
		} );
	} );
};

module.exports = {
	exec,
	spawn,
};
