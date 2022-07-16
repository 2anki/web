const getHeadersFilename = (headers: Response['headers']) => {
  const filename = headers.get('File-Name');
  return decodeURIComponent(filename);
};

export default getHeadersFilename;
