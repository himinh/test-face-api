import { LangEnum } from '@enum/lang.enum';

export function convertDataByLang(
  obj: { [key: string]: any },
  lang: LangEnum,
  keys: string[],
) {
  keys.forEach((key) => {
    /* eslint-disable no-param-reassign */
    if (obj[key]) {
      obj[key] = typeof obj[key] === 'string' ? obj[key] : obj[key][lang];
    }
    /* eslint-enable no-param-reassign */
  });
}
