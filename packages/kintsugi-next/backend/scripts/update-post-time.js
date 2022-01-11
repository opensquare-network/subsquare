const dotenv = require("dotenv");
dotenv.config();

const {
  getTreasuryProposalCollection,
  getDemocracyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
} = require("../mongo/chain");

async function updateTreasuryProposal() {
  const chainDb = await getChainDb();

  const col = await getTreasuryProposalCollection();
  const items = await col.find({}).toArray();
  const onchainDatas = await chainDb.lookupOne({
    from: "treasuryProposal",
    for: items,
    as: "onchainData",
    localField: "proposalIndex",
    foreignField: "proposalIndex",
  });

  await chainDb.lookupMany({
    from: "motion",
    for: onchainDatas,
    as: "motions",
    localField: "proposalIndex",
    foreignField: "treasuryProposals.index",
  });

  if (items.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of items) {
      const lastActivityAt = new Date(
        Math.max(
          ...(item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]),
          item.onchainData?.state?.indexer?.blockTime || 0,
          ...(item.onchainData?.motions || []).map(
            (m) => m.state?.indexer?.blockTime || 0
          )
        )
      );
      bulk.find({ proposalIndex: item.proposalIndex }).updateOne({
        $set: {
          lastActivityAt,
        },
      });
    }
    await bulk.execute();
  }
}

async function updatePublicProposal() {
  const chainDb = await getChainDb();

  const col = await getDemocracyCollection();
  const items = await col
    .find({
      proposalIndex: { $ne: null },
    })
    .toArray();

  await Promise.all([
    chainDb.lookupOne({
      from: "democracyPublicProposal",
      for: items,
      as: "democracyPublicProposal",
      localField: "proposalIndex",
      foreignField: "proposalIndex",
    }),
    chainDb.lookupOne({
      from: "democracyReferendum",
      for: items,
      as: "democracyReferendum",
      localField: "referendumIndex",
      foreignField: "referendumIndex",
    }),
  ]);

  if (items.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of items) {
      const lastActivityAt = new Date(
        Math.max(
          ...(item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]),
          item.democracyPublicProposal?.state?.indexer?.blockTime || 0,
          item.democracyReferendum?.state?.indexer?.blockTime || 0
        )
      );
      bulk.find({ proposalIndex: item.proposalIndex }).updateOne({
        $set: {
          lastActivityAt,
        },
      });
    }
    await bulk.execute();
  }
}

async function main() {
  try {
    await updateTreasuryProposal();
    await updatePublicProposal();

    console.log(`Last run at`, new Date());
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
}

main();
