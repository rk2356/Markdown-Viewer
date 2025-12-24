
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    // Keep English, Numbers, Hindi (Devanagari \u0900-\u097F), and Dashes. 
    // Remove other punctuation like ( ) ? ! :
    .replace(/[^\w\u0900-\u097F\-]+/g, '') 
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
