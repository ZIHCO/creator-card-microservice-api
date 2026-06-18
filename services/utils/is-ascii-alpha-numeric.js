/**
 *
 * @param {String} str
 * @returns {Boolean}
 */
function isAsciiAlphaNumeric(str) {
  let result = true;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);
    const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122); // A-Z, a-z
    const isNumber = code >= 48 && code <= 57; // 0-9

    if (!isLetter && !isNumber) {
      result = false;
    }
  }

  return result;
}

module.exports = isAsciiAlphaNumeric;
