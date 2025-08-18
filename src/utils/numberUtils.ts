import { AnimationConfigs, CharWithId, SeparatorType } from '../types';

// Use a more robust ID generation strategy
class IdGenerator {
  private static instance: IdGenerator;
  private counter: number = 0;
  private readonly prefix: string;

  private constructor() {
    this.prefix = `char_${Date.now()}_`;
  }

  static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator();
    }
    return IdGenerator.instance;
  }

  generate(): string {
    return `${this.prefix}${++this.counter}`;
  }

  reset(): void {
    this.counter = 0;
  }
}

const idGenerator = IdGenerator.getInstance();

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
  decimalSeparator: string,
  thousandSeparator: string,
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

export const updateCharList = (
  newInput: string | number,
  prev: CharWithId[],
  separator: SeparatorType = 'comma',
): CharWithId[] => {
  const sepChar = separator === 'comma' ? ',' : '.';
  const nextChars = newInput.toString().split('');
  const next: CharWithId[] = [];
  const used = new Set<number>();

  const newSepIndexes = nextChars
    .map((char, i) => ({ char, index: i }))
    .filter((item) => item.char === sepChar);

  const prevSeps = prev
    .map((item, i) => ({ ...item, index: i }))
    .filter((item) => item.char === sepChar);

  const sepMap = new Map<number, CharWithId>();

  const newSepCount = newSepIndexes.length;
  const prevSepCount = prevSeps.length;

  const freshCount =
    newSepCount >= prevSepCount ? newSepCount - prevSepCount : 0;

  const prevStartIndex =
    newSepCount < prevSepCount ? prevSepCount - newSepCount : 0;

  for (let i = 0; i < newSepIndexes.length; i++) {
    const newSep = newSepIndexes[i];

    if (i < freshCount) {
      sepMap.set(newSep.index, {
        id: idGenerator.generate(),
        char: sepChar,
      });
    } else {
      const prevMatch = prevSeps[prevStartIndex + i - freshCount];
      if (prevMatch) {
        sepMap.set(newSep.index, {
          id: prevMatch.id,
          char: prevMatch.char,
        });
        used.add(prevMatch.index);
      }
    }
  }

  for (let i = 0; i < nextChars.length; i++) {
    const char = nextChars[i];

    if (char === sepChar && sepMap.has(i)) {
      next.push(sepMap.get(i)!);
      continue;
    }

    const matchIndex = prev.findIndex((item, j) => {
      return !used.has(j) && item.char === char;
    });

    if (matchIndex !== -1) {
      used.add(matchIndex);
      next.push(prev[matchIndex]);
    } else {
      next.push({ id: idGenerator.generate(), char });
    }
  }

  return next;
};

export function createLayoutAnimation(baseAnim: any, config: AnimationConfigs) {
  let anim = baseAnim;

  if (config.type === 'timing') {
    anim = anim.duration(config.duration);

    if (typeof config.easing === 'function') {
      anim = anim.easing(config.easing);
    }
  }

  if (config.type === 'spring') {
    anim = anim.springify();

    if (typeof config.damping === 'number') {
      anim = anim.damping(config.damping);
    }
    if (typeof config.mass === 'number') {
      anim = anim.mass(config.mass);
    }
    if (typeof config.stiffness === 'number') {
      anim = anim.stiffness(config.stiffness);
    }

    if (typeof config.overshootClamp === 'boolean') {
      anim = anim.overshootClamp(config.overshootClamp);
    }
  }

  return anim;
}

export function estimateSpringDuration(
  mass: number = 1,
  stiffness: number = 100,
  damping: number = 10,
): number {
  const dampingRatio = damping / (2 * Math.sqrt(mass * stiffness));
  const settlingTime = 2 * Math.PI * Math.sqrt(mass / stiffness) * dampingRatio;
  return Math.round(settlingTime * 1000);
}
