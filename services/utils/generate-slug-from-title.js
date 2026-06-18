/**
 * @param {String} title
 * @returns {String}
 */
function generateSlugFromTitle(title) {
  let result = '';
  const copyTitle = title.toLowerCase().replaceAll(' ', '-');

  for (let i = 0; i < copyTitle.length; i++) {
    const charCode = copyTitle[i].charCodeAt(0);
    if (
      (charCode >= 97 && charCode <= 122) ||
      (charCode >= 48 && charCode <= 57) ||
      charCode === 45 ||
      charCode === 95
    ) {
      result += copyTitle[i];
    }
  }

  return result;
}

module.exports = generateSlugFromTitle;
