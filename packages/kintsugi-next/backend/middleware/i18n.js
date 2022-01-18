const { withI18n } = require("../services/i18n.service");

async function i18n(_, next) {
  await withI18n(next);
}

module.exports = i18n;
