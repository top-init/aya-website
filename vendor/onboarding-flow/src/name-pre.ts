const SEPARATOR_BY_LANG: Record<string, string> = {
  ja: '、',
  zh: '，',
  'zh-Hans': '，',
  'zh-Hant': '，',
  'zh-HK': '，',
  'zh-SG': '，',
  yue: '，',
  th: '',
};

// Pure: the language is passed in rather than read off a singleton, so the same
// function runs in the app (i18n.language) and in the web funnel (route locale).
export function getNamePre(name: string | undefined | null, lang = 'en'): string {
  if (!name) return '';
  const base = lang.split('-')[0];
  const sep = SEPARATOR_BY_LANG[lang] ?? SEPARATOR_BY_LANG[base] ?? ' ';
  return sep + name;
}
