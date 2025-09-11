export const LANGUAGE_CODES = {
  SOURCE: "SOURCE",
  CHINESE_SIMPLIFIED: "SC",
  SPANISH: "ES",
  RUSSIAN: "RU",
};

export const DEFAULT_LANGUAGE_OPTION = {
  label: "Source",
  value: LANGUAGE_CODES.SOURCE,
};

export const AVAILABLE_LANGUAGES = [
  {
    label: "Chinese (Simplified)",
    value: LANGUAGE_CODES.CHINESE_SIMPLIFIED,
  },
  {
    label: "Spanish",
    value: LANGUAGE_CODES.SPANISH,
  },
  {
    label: "Russian",
    value: LANGUAGE_CODES.RUSSIAN,
  },
];

export const ALL_LANGUAGE_OPTIONS = [
  DEFAULT_LANGUAGE_OPTION,
  ...AVAILABLE_LANGUAGES,
];

export const EDITED_TRANSLATIONS = {
  [LANGUAGE_CODES.SOURCE]: "Edited",
  [LANGUAGE_CODES.CHINESE_SIMPLIFIED]: "已编辑",
  [LANGUAGE_CODES.SPANISH]: "Editado",
  [LANGUAGE_CODES.RUSSIAN]: "Отредактировано",
};
