const { calcMultisigAddress } = require("../../../utils/call");
const {
  business: {
    consts: { Modules, MultisigMethods, ProxyMethods },
  },
} = require("@subsquare/scan-common");

function getRealCaller(call, caller) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return call.args[0].toJSON();
  }

  if (Modules.Multisig === section && MultisigMethods.asMulti === method) {
    const threshold = call.args[0].toNumber();
    const otherSignatories = call.args[1].toJSON();
    return calcMultisigAddress(
      [caller, ...otherSignatories],
      threshold,
      call.registry.chainSS58
    );
  }

  return caller;
}

module.exports = {
  getRealCaller,
};
