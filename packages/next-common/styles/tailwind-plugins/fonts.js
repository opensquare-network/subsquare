const plugin = require("tailwindcss/plugin");

exports.fonts = {
  ".text20BoldLogo": {
    "font-size": "24px",
    "font-family": "var(--font-montserrat, Montserrat)",
    "font-weight": 700,
    "line-height": "32px",
  },
  ".text20Bold": {
    "font-size": "20px",
    "font-weight": 700,
    "line-height": "32px",
  },
  ".text16Bold": {
    "font-size": "16px",
    "font-weight": 700,
    "line-height": "24px",
  },
  ".text16Medium": {
    "font-size": "16px",
    "font-weight": 500,
    "line-height": "24px",
  },
  ".text15MediumContent": {
    "font-size": "15px",
    "font-weight": 500,
    "line-height": "28px",
  },
  ".text14Bold": {
    "font-size": "14px",
    "font-weight": 700,
    "line-height": "20px",
  },
  ".text14Medium": {
    "font-size": "14px",
    "font-weight": 500,
    "line-height": "20px",
  },
  ".text12Bold": {
    "font-size": "12px",
    "font-weight": 700,
    "line-height": "16px",
  },
  ".text12Medium": {
    "font-size": "12px",
    "font-weight": 500,
    "line-height": "16px",
  },
  ".text12Normal": {
    "font-size": "12px",
    "font-weight": 400,
    "line-height": "16px",
  },
};

module.exports = plugin(({ addComponents }) => {
  addComponents(exports.fonts);
});
