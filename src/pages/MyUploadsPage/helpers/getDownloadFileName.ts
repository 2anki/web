export const getDownloadFileName = (fileName: string) => {
  if (fileName.toLowerCase().endsWith('.apkg')) {
    return fileName;
  }
  return `${fileName}.apkg`;
};
