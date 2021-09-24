const query = 'mickey';

// Get the user agent language, fall back to English if unknown.
const language = navigator.language !== null ? navigator.language : 'en';
// language may contain a dash, e.g., 'en-US':
// Extract language code, avoiding the unnecessary call to split.
const langCode = language.indexOf( '-' ) === -1 ? language : language.split( '-' )[ 0 ];
const search_api = `https://${langCode}.wikipedia.org/w/rest.php/v1/search/title?limit=10&q=`;
// Basic unordered list.
const resultList = document.createElement( 'ul' );
// TODO Internationalize this!
const lastItemContent = `Search for pages containing [${ query }] ...`;

// Process and append a Wikipedia Search API result page into an HTML list item.
function appendResult( result, list ) {
	const listItem = document.createElement( 'li' );

	// Add optional thumbnail.
	const thumbnailValue = result.thumbnail;
	if ( thumbnailValue !== null ) {
		const thumbnail = document.createElement( 'img' );
		// The API doesn't return the URL protocol.
		thumbnail.src = `https:${ thumbnailValue.url }`;
		listItem.appendChild( thumbnail );
	}

	// Add title.
	const title = document.createElement( 'strong' );
	const titleContent = document.createTextNode( result.title );
	title.appendChild( titleContent );
	listItem.appendChild( title );

	// Add optional description.
	const descriptionValue = result.description;
	if ( descriptionValue !== null ) {
		const description = document.createElement( 'p' );
		const descriptionContent = document.createTextNode( descriptionValue );
		description.appendChild( descriptionContent );
		listItem.appendChild( description );
	}

	list.appendChild( listItem );
}

fetch( search_api + query )
	// Handle HTTP status.
	.then( response => {
		// Throw a generic error in case of a non-2xx status.
		if ( !response.ok ) {
			throw new Error( `Got HTTP ${ response.status }` );
		}
  	return response.json();
	})
	// Handle response.
	.then( json => {
		json.pages.forEach( page => appendResult( page, resultList ) );

		// Append last list item.
		const lastItem = document.createElement( 'li' );
		const content = document.createTextNode( lastItemContent );
		lastItem.appendChild( content );
		resultList.appendChild( lastItem );
	})
	// Handle errors.
	.catch( error => {
		console.error( `Something went wrong! ${error}` );
	})

// Show the final output.
document.body.append( resultList );

