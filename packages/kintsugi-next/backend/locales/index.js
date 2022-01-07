const fs = require("fs");
const path = require("path");

const locales = fs
  .readdirSync(__dirname)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({
    name: f.slice(0, f.lastIndexOf(".")),
    translation: JSON.parse(
      fs.readFileSync(path.join(__dirname, f), { encoding: "utf8" })
    ),
  }))
  .reduce((d, t) => {
    d[t.name] = t.translation;
    return d;
  }, {});

module.exports = locales;
