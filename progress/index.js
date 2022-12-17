const ProgressBar = require( 'progress' );

/**
 * Initialize a progress bar.
 *
 * @param {number} total    Total item count.
 * @param {string} [format] ProgressBar format string.
 * @returns {ProgressBar} Initialized progress bar.
 */
const progressBar = ( total, format = ':current / :total :bar :percent :etas' ) => {
	return new ProgressBar( format, { total } );
};

/**
 *
 */
class MockStream {
	constructor() {
		this.isTTY = true;
		this.columns = 100;
		this.output = '';
	}
	cursorTo() {}
	clearLine() {}
	write( str ) {
		if ( str.trim() ) {
			this.output = str;
		}
	}
	toString() {
		return this.output;
	}
	// This method is not present in the Stream object we're mocking, but it
	// makes it easier to clear out and reuse one stream for many bars.
	reset() {
		this.output = '';
	}
}

/**
 *
 */
class NestedProgressBar {
	constructor( groupCount, format = '(:percent) :bar [:current/:total] :subbar' ) {
		this.bar = new ProgressBar( format, {
			total: groupCount,
			width: 60,
		} );
		this.nestedBarOutput = new MockStream();
	}

	/**
	 * Start a nested progress bar group.
	 *
	 * @param {number} total Count of items in group.
	 */
	startGroup( total ) {
		if ( this.nestedBar ) {
			this.nestedBar.update( 1 );
		}
		this.nestedBar = new ProgressBar( ':bar :current', {
			total,
			width: 20,
			stream: this.nestedBarOutput,
		} );
	}

	tick() {
		this.nestedBar.update( 1 );
		this.bar.tick( 1, {
			subbar: this.nestedBar ? this.nestedBarOutput.toString() : '',
		} );
	}

	nestedTick() {
		if ( ! this.nestedBar ) {
			return;
		}

		this.nestedBar.tick();
		this.bar.tick( 0, {
			subbar: this.nestedBarOutput.toString(),
		} );
	}

	terminate() {
		this.nestedBarOutput.reset();
		this.bar.terminate();
	}
}

/**
 * Instantiate a nested progress bar of a certain number of groups.
 *
 * @param {number} groupCount Number of groups
 * @param {string} [format]   ProgressBar format to use. :subbar is nested bar token.
 * @returns {NestedProgressBar} Instantiated nested bar.
 */
const nestedProgressBar = ( groupCount, format ) => new NestedProgressBar( groupCount, format );

// Example implementation.
// ( async () => {
// 	const bar = nestedBar( 9 );

// 	for ( let y = 0; y < 9; y++ ) {
// 		bar.startGroup( 10 );
// 		for ( let i = 0; i < 10; i++ ) {
// 			await wait( 100 );
// 			bar.nestedTick();
// 		}
// 		bar.tick();
// 	}
// } )();

module.exports = {
	progressBar,
	nestedProgressBar,
	ProgressBar,
};
