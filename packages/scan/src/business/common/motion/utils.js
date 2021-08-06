const { getApi } = require("../../../api");
const { isKarura } = require("../../../env");
const { u8aToHex } = require("@polkadot/util");

function normalizeCall(call) {
  const { section, method } = call;
  const callIndex = u8aToHex(call.callIndex);

  const args = [];
  for (let index = 0; index < call.args.length; index++) {
    const arg = call.args[index];

    const argMeta = call.meta.args[index];
    const name = argMeta.name.toString();
    const type = argMeta.type.toString();
    if (type === "CallOf") {
      args.push({
        name,
        type,
        value: normalizeCall(arg),
      });
      continue;
    }

    args.push({
      name,
      type,
      value: arg.toJSON(),
    });
  }

  return {
    callIndex,
    section,
    method,
    args,
  };
}

async function getProposalFromStorage(hash, blockHash) {
  const api = await getApi();
  let proposal;
  if (isKarura()) {
    proposal = await api.query.generalCouncil.proposalOf.at(blockHash, hash);
  } else {
    proposal = await api.query.council.proposalOf.at(blockHash, hash);
  }
  if (!proposal.isSome) {
    return null;
  }

  return normalizeCall(proposal.value);
}

module.exports = {
  getProposalFromStorage,
};
