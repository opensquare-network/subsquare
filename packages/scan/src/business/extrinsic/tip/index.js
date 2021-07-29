const { TipMethods, Modules } = require("../../common/constants");

async function handleTipCall(call, author, extrinsicIndexer) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.tip !== call.method
  ) {
    return;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();

  // TODO: update tip status
  console.log(hash, tipValue);
}

module.exports = {
  handleTipCall,
};
