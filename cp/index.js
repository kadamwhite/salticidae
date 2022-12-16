const cp = require( 'child_process' );

/**
 * Execute an arbitrary string command.
 *
 * @param {string} command A bash command string, including arguments.
 * @returns {Promise} A promise which will resolve when the executed command exits.
 */
const exec = ( command ) => {
	return new Promise( ( resolve, reject ) => {
		cp.exec( command, ( error ) => {
			if ( error ) {
				return reject( error );
			}
			resolve();
		} );
	} );
};

/**
 * Default mode for spawn invocation. Output to stdio and stderr, resolve when
 * child process exits, but do not resolve with any specific value. Reject with
 * error object or code, depending on error state.
 *
 * @private
 * @param {cp.ChildProcess}        spawnedProcess Invoked child process.
 * @param {(value: any) => void}   resolve        Promise constructor resolve function.
 * @param {(reason?: any) => void} reject         Promise constructor reject function.
 */
const useInheritedStdIO = ( spawnedProcess, resolve, reject ) => {
	spawnedProcess.on( 'error', ( err ) => reject( err ) );

	spawnedProcess.on( 'close', ( code, signal ) => {
		if ( code ) {
			reject();
			return;
		}
		resolve();
	} );
};

/**
 * Assuming 'pipe' mode for stdout and stderr, resolve or reject promise with
 * the contents output to those respective streams.
 *
 * @private
 * @param {cp.ChildProcess}        spawnedProcess Invoked child process.
 * @param {(value: any) => void}   resolve        Promise constructor resolve function.
 * @param {(reason?: any) => void} reject         Promise constructor reject function.
 */
const usePipedStdIO = ( spawnedProcess, resolve, reject ) => {
	const stdio = [];
	spawnedProcess.stdout.on( 'data', ( chunk ) => {
		stdio.push( chunk.toString() );
	} );

	const stderr = [];
	spawnedProcess.stderr.on( 'data', ( chunk ) => {
		stderr.push( chunk.toString() );
	} );

	spawnedProcess.on( 'error', ( err ) => {
		reject( err );
	} );

	spawnedProcess.on( 'close', ( code, signal ) => {
		if ( code ) {
			reject( stderr.join( '\n' ) );
			return;
		}
		resolve( stdio.join( '\n' ) );
	} );
};

/**
 * Execute a command as a spawned process.
 *
 * @param {string}               command    A bash command string, excluding arguments.
 * @param {Array<string|number>} args       Array of argument strings for the provided command.
 * @param {cp.SpawnOptions}      [options]  cp.spawn options object.
 * @param {(
 *   spawnedProcess: cp.ChildProcess,
 *   resolve: (value: any) => void,
 *   reject: (reason?: any) => void
 * ) => void} [callback] Handler function to control processing and resolution.
 *
 * @returns {Promise} Promise that resolves depending on actions within callback().
 */
const spawn = ( command, args, options = {}, callback = useInheritedStdIO ) => {
	return new Promise( ( resolve, reject ) => {
		const spawnedProcess = cp.spawn( command, args, {
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

/**
 * Execute a command as a spawned process. Inherit stdio from parent process;
 * output will be rendered, but promises will be empty.
 *
 * @param {string}               command    A bash command string, excluding arguments.
 * @param {Array<string|number>} args       Array of argument strings for the provided command.
 * @returns {Promise} Promise that resolves when the child process completes or errors.
 */
spawn.withInheritedStdIO = ( command, args ) => spawn( command, args, {}, useInheritedStdIO );

/**
 * Execute a command as a spawned process with piped stdio. The promise will
 * resolve or reject with the string contents output to stdout and stderr,
 * respectively.
 *
 * @param {string}               command    A bash command string, excluding arguments.
 * @param {Array<string|number>} args       Array of argument strings for the provided command.
 * @returns {Promise<string>} Promise that resolves to stdout when the child process completes,
 *                            or the contents of stderr if it errors.
 */
spawn.withPipedStdIO = ( command, args ) => spawn( command, args, {
	// Be a TTY but also permit capturing output.
	stdio: [ 'inherit', 'pipe', 'pipe' ],
}, usePipedStdIO );

module.exports = {
	exec,
	spawn,
};
