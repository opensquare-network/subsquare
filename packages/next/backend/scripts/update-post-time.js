const dotenv = require("dotenv");
dotenv.config();

const {
  getTipCollection,
  getTreasuryProposalCollection,
  getBountyCollection,
  getDemocracyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getTechCommMotionCollection: getChainTechCommMotionCollection,
} = require("../mongo/chain");

async function updateTip() {
  const chainDb = await getChainDb();

  const col = await getTipCollection();
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
          ...(item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]),
          item.onchainData?.state?.indexer?.blockTime || 0
        )
      );
      bulk
        .find({
          "indexer.blockHeight": item.indexer.blockHeight,
          hash: item.hash,
        })
        .updateOne({
          $set: {
            lastActivityAt,
          },
        });
    }
    await bulk.execute();
  }
}

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

async function updateExternalProposal() {
  const chainDb = await getChainDb();

  const col = await getDemocracyCollection();
  const items = await col
    .find({
      externalProposalHash: { $ne: null },
    })
    .toArray();

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

  const chainTechCommMotionsCol = await getChainTechCommMotionCollection();
  for (const external of democracyExternals) {
    const hash = external.proposalHash;
    const height = external.indexer.blockHeight;

    const techCommMotions = await chainTechCommMotionsCol
      .find({
        externalProposals: {
          $elemMatch: {
            hash,
            "indexer.blockHeight": height,
          },
        },
      })
      .toArray();

    external.techCommMotions = techCommMotions;
  }

  if (items.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of items) {
      const lastActivityAt = new Date(
        Math.max(
          ...(item.lastActivityAt.getTime() === item.createdAt.getTime()
            ? []
            : [item.lastActivityAt.getTime()]),
          item.democracyExternal?.state?.indexer?.blockTime || 0,
          ...(item.democracyExternal?.techCommMotions || []).map(
            (m) => m.state?.indexer?.blockTime || 0
          ),
          item.democracyReferendum?.state?.indexer?.blockTime || 0
        )
      );
      bulk
        .find({
          "indexer.blockHeight": item.indexer.blockHeight,
          externalProposalHash: item.externalProposalHash,
        })
        .updateOne({
          $set: {
            lastActivityAt,
          },
        });
    }
    await bulk.execute();
  }
}

async function updateBounty() {
  const chainDb = await getChainDb();

  const col = await getBountyCollection();
  const items = await col.find({}).toArray();
  const onchainDatas = await chainDb.lookupOne({
    from: "bounty",
    for: items,
    as: "onchainData",
    localField: "bountyIndex",
    foreignField: "bountyIndex",
  });

  await chainDb.lookupMany({
    from: "motion",
    for: onchainDatas,
    as: "motions",
    localField: "bountyIndex",
    foreignField: "treasuryBounties.index",
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
          ...(item.motions || []).map((m) => m.state?.indexer?.blockTime || 0)
        )
      );
      bulk.find({ bountyIndex: item.bountyIndex }).updateOne({
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
    await updateTip();
    await updateTreasuryProposal();
    await updatePublicProposal();
    await updateExternalProposal();
    await updateBounty();

    console.log(`Last run at`, new Date());
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
}

main();
