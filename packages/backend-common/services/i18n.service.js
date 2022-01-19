const { AsyncLocalStorage } = require("async_hooks");
const { format } = require("util");
const locales = require("../locales");

const i18nStorage = new AsyncLocalStorage();

function withI18n(next) {
  const lang = process.env.APP_LANGUAGE || "en_US";
  return i18nStorage.run(lang, next);
}

function t(msg, ...param) {
  const lang = i18nStorage.getStore();
  const tran = locales[lang];
  return format(tran?.[msg] || msg, ...param);
}

module.exports = {
  withI18n,
  t,
};
