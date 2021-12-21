module.exports = {
  ...require("./normalize"),
  ...require("./extractMotionCalls"),
  ...require("./findCall"),
  ...require("./getRealCaller"),
  ...require("./handle"),
  ...require("./utils"),
};
