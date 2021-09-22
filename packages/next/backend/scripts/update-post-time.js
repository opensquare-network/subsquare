const dotenv = require("dotenv");
dotenv.config();

const {
  getTipCollection, getTreasuryProposalCollection, getDemocracyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
} = require("../mongo/chain");

async function updateTip(chain) {
  const chainDb = await getChainDb(chain)

  const col = await getTipCollection(chain);
  const items = await col.find({}).toArray();
  await chainDb.compoundLookupOne({
    from: "tip",
    for: items,
    as: "onchainData",
    compoundLocalFields: ["hash", "height"],
    compoundForeignFields: ["hash", "indexer.blockHeight"],
  });

  if (items.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of items) {
      const lastActivityAt = new Date(
        Math.max(
          ...(
            item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]
          ),
          item.onchainData?.state?.indexer?.blockTime || 0,
        )
      );
      bulk.find({
        "indexer.blockHeight": item.indexer.blockHeight,
        hash: item.hash
      }).updateOne({
        $set: {
          lastActivityAt
        }
      });
    }
    await bulk.execute();
  }
}

async function updateTreasuryProposal(chain) {
  const chainDb = await getChainDb(chain)

  const col = await getTreasuryProposalCollection(chain);
  const items = await col.find({}).toArray();
  const onchainDatas = await chainDb.lookupOne({
    from: "treasuryProposal",
    for: items,
    as: "onchainData",
    localField: "proposalIndex",
    foreighField: "proposalIndex",
  });

  await chainDb.lookupMany({
    from: "motion",
    for: onchainDatas,
    as: "motions",
    localField: "proposalIndex",
    foreighField: "treasuryProposalIndex",
  });

  if (items.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of items) {
      const lastActivityAt = new Date(
        Math.max(
          ...(
            item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]
          ),
          item.onchainData?.state?.indexer?.blockTime || 0,
          ...(
            (item.motions || []).map(m => m.state?.indexer?.blockTime || 0)
          )
        )
      );
      bulk.find({proposalIndex: item.proposalIndex}).updateOne({
        $set: {
          lastActivityAt
        }
      });
    }
    await bulk.execute();
  }
}

async function updatePublicProposal(chain) {
  const chainDb = await getChainDb(chain)

  const col = await getDemocracyCollection(chain);
  const items = await col.find({
    proposalIndex: { $ne: null }
  }).toArray();

  await Promise.all([
    chainDb.lookupOne({
      from: "democracyPublicProposal",
      for: items,
      as: "democracyPublicProposal",
      localField: "proposalIndex",
      foreighField: "proposalIndex",
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
          ...(
            item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]
          ),
          item.democracyPublicProposal?.state?.indexer?.blockTime || 0,
          item.democracyReferendum?.state?.indexer?.blockTime || 0,
        )
      );
      bulk.find({proposalIndex: item.proposalIndex}).updateOne({
        $set: {
          lastActivityAt
        }
      });
    }
    await bulk.execute();
  }
}

async function updateExternalProposal(chain) {
  const chainDb = await getChainDb(chain)

  const col = await getDemocracyCollection(chain);
  const items = await col.find({
    externalProposalHash: { $ne: null }
  }).toArray();

  const [democracyExternals] = await Promise.all([
    chainDb.compoundLookupOne({
      from: "democracyExternal",
      for: items,
      as: "democracyExternal",
      compoundLocalFields: ["externalProposalHash", "indexer.blockHeight"],
      compoundForeignFields: ["proposalHash", "indexer.blockHeight"],
    }),
    chainDb.lookupOne({
      from: "democracyReferendum",
      for: items,
      as: "democracyReferendum",
      localField: "referendumIndex",
      foreignField: "referendumIndex",
    }),
  ]);

  await chainDb.lookupOne({
    from: "techCommMotion",
    for: democracyExternals,
    as: "techCommMotion",
    localField: "techCommMotionIndex",
    foreignField: "techCommMotionIndex",
  });

  if (items.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of items) {
      const lastActivityAt = new Date(
        Math.max(
          ...(
            item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]
          ),
          item.democracyExternal?.state?.indexer?.blockTime || 0,
          item.democracyReferendum?.state?.indexer?.blockTime || 0,
          item.democracyExternal?.techCommMotion?.state?.indexer?.blockTime || 0,
        )
      );
      bulk.find({
        "indexer.blockHeight": item.indexer.blockHeight,
        externalProposalHash: item.externalProposalHash
      }).updateOne({
        $set: {
          lastActivityAt
        }
      });
    }
    await bulk.execute();
  }
}

async function main() {
  const chain = process.env.CHAIN;

  try {
    await updateTip(chain);
    await updateTreasuryProposal(chain);
    await updatePublicProposal(chain);
    await updateExternalProposal(chain);

    console.log(`Last run at`, new Date());
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
}

main();
