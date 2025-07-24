export type CharData = {
  char: string;
  isSeparator: boolean;
  key: string;
  isExiting: boolean;
};

export const formatNumber = (
  numberStr: string,
  decimalSeparator: string,
  thousandSeparator: string,
  precision: number,
): string => {
  if (!numberStr) return '';
  const isNegative = numberStr.startsWith('-');
  if (isNegative) numberStr = numberStr.substring(1);
  numberStr = numberStr.replace(
    new RegExp(`[^0-9\\${decimalSeparator}]`, 'g'),
    '',
  );
  const parts = numberStr.split(decimalSeparator);
  const integerPart = parts[0] || '';
  const decimalPart = parts[1] || '';
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator,
  );
  let result = '';
  if (parts.length > 1) {
    result = `${formattedInteger}${decimalSeparator}${decimalPart.substring(0, precision)}`;
  } else {
    result = formattedInteger;
  }
  return isNegative ? `-${result}` : result;
};

export const getDigits = (
  text: string,
  decimalSeparator = '.',
  thousandSeparator = ',',
): CharData[] => {
  const results: CharData[] = [];
  let commaSeparatorCount = 0;
  let digitCount = 0;
  let key = '';
  const numberOfCommas = text.split(thousandSeparator).length - 1;
  text.split('').forEach((char) => {
    if (char === decimalSeparator) {
      key = `${char}-thousand`;
    } else if (char === thousandSeparator) {
      key = `${char}-${numberOfCommas - commaSeparatorCount}`;
      commaSeparatorCount++;
    } else {
      key = `${char}-${digitCount}`;
      digitCount++;
    }
    results.push({
      char,
      isSeparator: char === decimalSeparator || char === thousandSeparator,
      key,
      isExiting: false,
    });
  });
  return results;
};
