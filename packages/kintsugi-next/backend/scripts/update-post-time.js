const dotenv = require("dotenv");
dotenv.config();

const { getDemocracyCollection } = require("../mongo/business");
const { getDb: getChainDb } = require("../mongo/chain");

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
    await updatePublicProposal();

    console.log(`Last run at`, new Date());
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
}

main();
