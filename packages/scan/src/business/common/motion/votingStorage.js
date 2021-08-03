const { getApi } = require("../../../api");
const { isKarura } = require("../../../env");

async function getVotingFromStorage(hash, blockHash) {
  const api = await getApi();

  let voting;
  if (isKarura()) {
    voting = await api.query.generalCouncil.voting.at(blockHash, hash);
  } else {
    voting = await api.query.council.voting.at(blockHash, hash);
  }

  if (!voting.isSome) {
    return null;
  }

  return voting.value.toJSON();
}

module.exports = {
  getVotingFromStorage,
};
