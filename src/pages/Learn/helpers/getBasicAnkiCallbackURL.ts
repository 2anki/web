/**
 *
 * @param frontSide content for front
 * @param backSide content for back
 * @returns anki call back url
 */
export const getBasicAnkiCallbackURL = (frontSide: string, backSide: string) =>
  `anki://x-callback-url/addnote?type=basic&deck=2anki&fldFront=${frontSide}&fldBack=${backSide}&x-success=${window.location.href}`;
