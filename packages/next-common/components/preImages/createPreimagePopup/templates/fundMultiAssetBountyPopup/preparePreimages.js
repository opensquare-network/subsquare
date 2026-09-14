import queryPreimageLen from "next-common/hooks/preimages/query/len";

export default async function preparePreimages(api, proposalState) {
  const { metadata, metadataHash, encodedHash, encodedLength, notePreimageTx } =
    proposalState;
  const [metadataLength, proposalLength] = await Promise.all([
    queryPreimageLen(api, metadataHash),
    queryPreimageLen(api, encodedHash),
  ]);

  if (metadataLength === null && !metadata) {
    throw new Error("The metadata preimage must already exist on chain");
  }

  const calls = [];
  if (metadataLength === null) {
    calls.push(api.tx.preimage.notePreimage(metadata));
  }
  if (proposalLength === null) {
    calls.push(notePreimageTx);
  }

  let tx = calls[0] || notePreimageTx;
  if (calls.length > 1) {
    tx = api.tx.utility.batchAll(calls);
  }

  return {
    notePreimageTx: tx,
    preimageExists: calls.length === 0,
    proposalByteLength: proposalLength === null ? encodedLength : 0,
  };
}
