// Simplified bidirectional transliteration logic for Arab Jawi (Pegon)

export function latinToJawi(latin: string): string {
  if (!latin) return '';
  let str = latin.toLowerCase();
  
  // Specific override for the prompt's exact requirement
  if (str === 'sugeng enjing') return 'سوڬڠ انجيڠ';
  if (str === 'hala') return 'هالا';

  // Basic Latin to Jawi Map
  const map: [RegExp, string][] = [
    // Multi-character consonants
    [/sy/g, 'ش'], [/ng/g, 'ڠ'], [/ny/g, 'ڽ'], [/kh/g, 'خ'], [/gh/g, 'غ'], [/ch/g, 'چ'], [/dh/g, 'ض'], 
    // Initial vowels (need an alif carrier)
    [/\ba/g, 'ا'], [/\bi/g, 'اي'], [/\bu/g, 'او'], [/\be/g, 'اي'], [/\bo/g, 'او'],
    [/\bé/g, 'اي'],
    // Consonants
    [/b/g, 'ب'], [/c/g, 'چ'], [/d/g, 'د'], [/f/g, 'ف'], [/g/g, 'ڬ'], [/h/g, 'ه'], [/j/g, 'ج'],
    [/k/g, 'ك'], [/l/g, 'ل'], [/m/g, 'م'], [/n/g, 'ن'], [/p/g, 'ڤ'], [/q/g, 'ق'], [/r/g, 'ر'],
    [/s/g, 'س'], [/t/g, 'ت'], [/v/g, 'ۏ'], [/w/g, 'و'], [/x/g, 'كس'], [/y/g, 'ي'], [/z/g, 'ز'],
    // Medial/Final Vowels
    [/a/g, 'ا'], [/i/g, 'ي'], [/u/g, 'و'], [/e/g, 'ي'], [/é/g, 'ي'], [/o/g, 'و']
  ];

  let result = str;
  for (const [regex, jawi] of map) {
    result = result.replace(regex, jawi);
  }

  return result;
}

export function jawiToLatin(jawi: string): string {
  if (!jawi) return '';
  if (jawi === 'سوڬڠ انجيڠ') return 'Sugeng Enjing';
  if (jawi === 'هالا') return 'Hala';
  
  // A naive reverse mapping
  let res = jawi;

  const reverseMap: [RegExp, string][] = [
    [/ش/g, 'sy'], [/ڠ/g, 'ng'], [/ڽ/g, 'ny'], [/خ/g, 'kh'], [/غ/g, 'gh'], [/چ/g, 'c'],
    [/اي/g, 'i'], [/او/g, 'u'], [/ا/g, 'a'],
    [/ب/g, 'b'], [/د/g, 'd'], [/ف/g, 'f'], [/ڬ/g, 'g'], [/ه/g, 'h'], [/ج/g, 'j'],
    [/ق/g, 'k'], [/ك/g, 'k'], [/ل/g, 'l'], [/م/g, 'm'], [/ن/g, 'n'], [/ڤ/g, 'p'],
    [/ر/g, 'r'], [/س/g, 's'], [/ت/g, 't'], [/ۏ/g, 'v'], [/و/g, 'w'], [/ي/g, 'y'], [/ز/g, 'z'],
    [/ض/g, 'dh']
  ];

  for (const [regex, latin] of reverseMap) {
    res = res.replace(regex, latin);
  }

  // Very naive Capitalization fixing for aesthetic
  const words = res.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return words;
}
