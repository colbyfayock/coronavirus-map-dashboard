/**
 * isDomAvailable
 * @description Checks to see if the DOM is available by checking the existence of the window and document
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */

export function isDomAvailable() {
  return typeof window !== 'undefined' && !!window.document && !!window.document.createElement;
}

/**
 * commafy
 * @description Applies appropriate commas to large numbers
 */

export function commafy(value) {
  let numberString = `${value}`;

  numberString = numberString.split('');

  numberString.reverse();

  numberString = numberString.reduce((prev, current, index) => {
    const shouldComma = (index + 1) % 3 === 0 && index + 1 < numberString.length;
    let updatedValue = `${prev}${current}`;
    if ( shouldComma ) {
      updatedValue = `${updatedValue},`;
    }
    return updatedValue;
  }, '');

  numberString = numberString.split('');
  numberString.reverse()
  numberString = numberString.join('');

  return numberString;
}

/**
 * friendlyDate
 * @description Takes in a date value and returns a friendly version
 */

export function friendlyDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}