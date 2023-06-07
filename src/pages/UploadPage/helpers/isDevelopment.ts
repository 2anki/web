export const isDevelopment = () => {
  const regex = /2anki\.(com|net|de)/;
  return !regex.exec(window.location.host);
};
