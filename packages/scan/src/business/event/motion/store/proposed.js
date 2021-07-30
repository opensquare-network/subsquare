async function handleProposed(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, memberCount] = eventData;

  console.log(eventData);
}

module.exports = {
  handleProposed,
};
