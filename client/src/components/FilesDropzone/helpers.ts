export const determineFileType = (url: string): string => {
  // Sets of common image and document extensions
  const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp']);
  const documentExtensions = new Set(['pdf', 'doc', 'docx', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'odt', 'ods', 'odp']);

  // Extract the file extension from the URL
  const fileExtension = (url.split('.').pop() || '').toLowerCase();

  // Determine the file type based on the extension
  let fileType = 'unknown';
  if (imageExtensions.has(fileExtension)) {
    fileType = 'image';
  } else if (documentExtensions.has(fileExtension)) {
    fileType = 'document';
  }

  return fileType;
};
