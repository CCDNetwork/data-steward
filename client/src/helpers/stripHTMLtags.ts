export const stripHTMLTags = (data: string) => {
  if (data === null || data === '') {
    return '';
  }

  const strippedTags = data.replace(/(<([^>]+)>)/gi, '');
  return strippedTags.replace(/&nbsp;/g, ' ');
};
