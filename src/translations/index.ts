import en from './en.json';
import zh from './zh.json';

// 支持的语言类型
export type Language = 'en' | 'zh';

// 翻译资源类型
type TranslationResources = typeof en;

// 当前语言
let currentLanguage: Language = 'zh';

// 翻译资源
const translations: Record<Language, TranslationResources> = {
  en,
  zh,
};

// 切换语言
export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

// 获取当前语言
export const getLanguage = (): Language => {
  return currentLanguage;
};

// 翻译函数
export const t = (key: keyof TranslationResources, ...args: string[]): string => {
  const translation = translations[currentLanguage][key];
  
  if (!translation) {
    console.warn(`Translation not found for key: ${key}`);
    return key;
  }
  
  // 处理带有参数的翻译
  if (args.length > 0) {
    return args.reduce((result, arg, index) => {
      return result.replace(`{${index}}`, arg);
    }, translation);
  }
  
  return translation;
};
