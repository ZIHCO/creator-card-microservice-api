/**
 * @param {Number} num
 * @returns {Boolean}
 */
function isPositiveInteger(num) {
  let result = num > 0;

  if (result) {
    const code = num % 10;
    const units = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    result = units.includes(code);
  }

  return result;
}

module.exports = isPositiveInteger;
