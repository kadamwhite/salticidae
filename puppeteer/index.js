const puppeteer = require( 'puppeteer' );

let browserInstance = null;

/**
 * Get a shared Puppeteer browser instance, initializing it if necessary.
 *
 * @async
 * @returns {Promise<puppeteer.Browser>} Initialized Browser instance.
 */
const getBrowser = async () => {
	if ( ! browserInstance ) {
		browserInstance = await puppeteer.launch();
	}
	return browserInstance;
};

/**
 * Close the browser instance.
 *
 * @async
 * @returns {Promise} Promise resolving once browser has closed.
 */
const closeBrowser = getBrowser().then( browser => browser.close() );

/**
 * Open a new page within the browser.
 *
 * @async
 * @returns {Promise<puppeteer.Page>} Promise to a Puppeteer page object.
 */
const getNewPage = () => getBrowser().then( browser => browser.newPage() );

/**
 * Navigate to a page with the browser.
 *
 * @async
 * @param {string}              url  Web resource to open in this page.
 * @param {puppeteer.Page|null} page Existing page object, or null.
 * @returns {Promise<{
 *   page: puppeteer.Page,
 *   response: Promise<puppeteer.HTTPResponse|null>
 * }>} Resolves to object with "page" and "response" properties.
 */
const getPage = async ( url, page = null ) => {
	page = page || await getNewPage();

	const response = await page.goto( url, { waitUntil: 'networkidle0' } );

	const arr = {
		one: 1,
		two: 2,
	};
	return { page, response };
};

/**
 * Return the contents of a page in Buffer form.
 *
 * @async
 * @param {string}              url  Web resource to open in this page.
 * @param {puppeteer.Page|null} page Existing page object, or null.
 * @returns {Promise<Buffer>} Page response as buffer.
 */
const getPageAsBuffer = async ( url, page = null ) => {
	const { response } = await getPage( url, page );
	return response.buffer();
};

/**
 * Download the contents of a remote URI to a location on disk.
 *
 * @async
 * @param {string} uri       Resource URL
 * @param {string} localPath Path to save image
 * @returns {Promise} Resolves when download completes.
 */
const download = async ( uri, localPath ) => {
	const buffer = await getPageAsBuffer( uri );
    fs.createReadStream( localPath ).pipe( buffer );
};

module.exports = {
	getBrowser,
	closeBrowser,
	getNewPage,
	getPage,
	getPageAsBuffer,
	download,
}
