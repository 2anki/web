/**
 * Function to get accepted content types
 * For now this is a hardcoded string in the client but should be retrieved from the backend.
 *
 * @returns comma seperated string with supported file types
 */
export default function getAcceptedContentTypes(): string {
  return '.zip,.html,.csv';
}
