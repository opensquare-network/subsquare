import { useEffect, useState } from "react";
import { BN_ONE, BN_ZERO } from "@polkadot/util";
import useApi from "../utils/hooks/useApi";
import useCall from "../utils/hooks/useCall";
import { useBlockTime } from "../utils/hooks";
import { useLeaseRangeMax } from "./useLeaseRanges";

function newDate(blocks, blockTime) {
  const date = new Date(
    Date.now() + blocks?.mul(blockTime || BN_ZERO).toNumber(),
  );

  return { date, dateTime: date.getTime() };
}

function createConstDurations(bestNumber, blockTime, items) {
  return items.map(
    ([category, type, duration, additional = BN_ZERO, offset = BN_ZERO]) => {
      if (!duration) {
        return [type, []];
      }

      const startNumber = bestNumber.sub(offset);
      const blocks = duration.sub(startNumber.mod(duration));

      return [
        type,
        [
          {
            ...newDate(blocks, blockTime),
            blockNumber: startNumber.add(blocks),
            blocks,
            info: startNumber.div(duration).iadd(additional),
            category,
            subCategory: type,
          },
        ],
      ];
    },
  );
}

function createCouncilMotions(bestNumber, blockTime, motions) {
  return [
    [
      "councilMotion",
      motions
        .map(({ hash, votes }) => {
          if (!votes) {
            return null;
          }

          const hashStr = hash.toHex();
          const blocks = votes.end.sub(bestNumber);

          return {
            ...newDate(blocks, blockTime),
            blockNumber: votes.end,
            blocks,
            info: `${hashStr.slice(0, 6)}…${hashStr.slice(-4)}`,
            category: "Collectives",
            subCategory: "Council Motion",
          };
        })
        .filter((item) => !!item),
    ],
  ];
}

// function createDispatches(bestNumber, blockTime, dispatches) {
//   return dispatches.map(({ at, index }) => {
//     const blocks = at.sub(bestNumber);

//     return [
//       "democracyDispatch",
//       [
//         {
//           ...newDate(blocks, blockTime),
//           blockNumber: at,
//           blocks,
//           info: index,
//         },
//       ],
//     ];
//   });
// }

function createReferendums(bestNumber, blockTime, referendums) {
  return referendums.reduce((result, { index, status }) => {
    const enactBlocks = status.end.add(status.delay).isub(bestNumber);
    const voteBlocks = status.end.sub(bestNumber).isub(BN_ONE);

    result.push([
      "referendumVote",
      [
        {
          ...newDate(voteBlocks, blockTime),
          blockNumber: bestNumber.add(voteBlocks),
          blocks: voteBlocks,
          info: index,
          category: "Democracy",
          subCategory: "Referendum",
        },
      ],
    ]);
    result.push([
      "referendumDispatch",
      [
        {
          ...newDate(enactBlocks, blockTime),
          blockNumber: bestNumber.add(enactBlocks),
          blocks: enactBlocks,
          info: index,
          isPending: true,
          category: "Democracy",
          subCategory: "Referendum",
        },
      ],
    ]);

    return result;
  }, []);
}

function createStakingInfo(
  bestNumber,
  blockTime,
  sessionInfo,
  unapplied,
  slashDeferDuration,
) {
  const blocksEra = sessionInfo.eraLength.sub(sessionInfo.eraProgress);
  const blocksSes = sessionInfo.sessionLength.sub(sessionInfo.sessionProgress);
  const slashDuration = slashDeferDuration?.mul(sessionInfo.eraLength);
  const slashEras = slashDuration
    ? unapplied
        .filter(([, values]) => values.length)
        .map(([key]) => {
          const eraIndex = key.args[0];
          const blockProgress = sessionInfo.activeEra
            .sub(eraIndex)
            .isub(BN_ONE)
            .imul(sessionInfo.eraLength)
            .iadd(sessionInfo.eraProgress);
          const blocks = slashDuration.sub(blockProgress);

          return {
            ...newDate(blocks, blockTime),
            blockNumber: bestNumber.add(blocks),
            blocks,
            info: eraIndex,
          };
        })
    : [];

  return [
    [
      "stakingEpoch",
      [
        {
          ...newDate(blocksSes, blockTime),
          blockNumber: bestNumber.add(blocksSes),
          blocks: blocksSes,
          info: sessionInfo.currentIndex.add(BN_ONE),
          category: "Staking",
          subCategory: "Epoch",
        },
      ],
    ],
    [
      "stakingEra",
      [
        {
          ...newDate(blocksEra, blockTime),
          blockNumber: bestNumber.add(blocksEra),
          blocks: blocksEra,
          info: sessionInfo.activeEra.add(BN_ONE),
          category: "Staking",
          subCategory: "Era",
        },
      ],
    ],
    [
      "stakingSlash",
      slashEras.map((item) => ({
        ...item,
        category: "Staking",
        subCategory: "Slash",
      })),
    ],
  ];
}

function createScheduled(bestNumber, blockTime, scheduled) {
  return [
    [
      "scheduler",
      scheduled
        .filter(([, vecSchedOpt]) =>
          vecSchedOpt.some((schedOpt) => schedOpt.isSome),
        )
        .reduce((items, [key, vecSchedOpt]) => {
          const blockNumber = key.args[0];

          return vecSchedOpt
            .filter((schedOpt) => schedOpt.isSome)
            .map((schedOpt) => schedOpt.unwrap())
            .reduce((items, { maybeId }) => {
              const idOrNull = maybeId.unwrapOr(null);
              const blocks = blockNumber.sub(bestNumber);

              items.push({
                ...newDate(blocks, blockTime),
                blockNumber,
                blocks,
                info: idOrNull
                  ? idOrNull.isAscii
                    ? idOrNull.toUtf8()
                    : idOrNull.toHex()
                  : null,
                category: "Scheduler",
                subCategory: "scheduler",
              });

              return items;
            }, items);
        }, []),
    ],
  ];
}

function createAuctionInfo(
  bestNumber,
  blockTime,
  rangeMax,
  [leasePeriod, endBlock],
) {
  const blocks = endBlock.sub(bestNumber);

  return [
    [
      "parachainAuction",
      [
        {
          ...newDate(blocks, blockTime),
          blockNumber: endBlock,
          blocks,
          info: `${leasePeriod.toString()} - ${leasePeriod
            .add(rangeMax)
            .toString()}`,
          category: "Parachain",
        },
      ],
    ],
  ];
}

function addFiltered(state, types) {
  return types.reduce((state, [typeFilter, items]) => {
    return state
      .filter(({ type }) => type !== typeFilter)
      .concat(
        ...items.map((item) => {
          item.type = typeFilter;

          return item;
        }),
      );
  }, state);
}

// TODO council votes, tips closing
function useScheduled() {
  const api = useApi();
  const blockTime = useBlockTime(api);
  const leaseRangeMax = useLeaseRangeMax();
  const bestNumber = useCall(api?.derive.chain.bestNumber);
  const auctionInfo = useCall(api?.query.auctions?.auctionInfo);
  const councilMotions = useCall(api?.derive.council?.proposals);
  // const dispatches = useCall(api?.derive.democracy?.dispatchQueue);
  const referendums = useCall(api?.derive.democracy?.referendums);
  const scheduled = useCall(api?.query.scheduler?.agenda?.entries);
  const sessionInfo = useCall(api?.derive.session?.progress);
  const slashes = useCall(api?.query.staking?.unappliedSlashes.entries);
  const [state, setState] = useState([]);

  // useEffect(() => {
  //   bestNumber && dispatches && setState((state) =>
  //     addFiltered(state, createDispatches(bestNumber, blockTime, dispatches))
  //   );
  // }, [bestNumber, blockTime, dispatches]);

  useEffect(() => {
    bestNumber &&
      councilMotions &&
      setState((state) =>
        addFiltered(
          state,
          createCouncilMotions(bestNumber, blockTime, councilMotions),
        ),
      );
  }, [bestNumber, blockTime, councilMotions]);

  useEffect(() => {
    bestNumber &&
      referendums &&
      setState((state) =>
        addFiltered(
          state,
          createReferendums(bestNumber, blockTime, referendums),
        ),
      );
  }, [bestNumber, blockTime, referendums]);

  useEffect(() => {
    bestNumber &&
      scheduled &&
      setState((state) =>
        addFiltered(state, createScheduled(bestNumber, blockTime, scheduled)),
      );
  }, [bestNumber, blockTime, scheduled]);

  useEffect(() => {
    bestNumber &&
      sessionInfo?.sessionLength.gt(BN_ONE) &&
      setState((state) =>
        addFiltered(
          state,
          createStakingInfo(
            bestNumber,
            blockTime,
            sessionInfo,
            slashes || [],
            api?.consts.staking?.slashDeferDuration,
          ),
        ),
      );
  }, [api, bestNumber, blockTime, sessionInfo, slashes]);

  useEffect(() => {
    bestNumber &&
      auctionInfo?.isSome &&
      setState((state) =>
        addFiltered(
          state,
          createAuctionInfo(
            bestNumber,
            blockTime,
            leaseRangeMax,
            auctionInfo.unwrap(),
          ),
        ),
      );
  }, [auctionInfo, bestNumber, blockTime, leaseRangeMax]);

  useEffect(() => {
    bestNumber &&
      setState((state) =>
        addFiltered(
          state,
          createConstDurations(bestNumber, blockTime, [
            [
              "Collectives",
              "councilElection",
              (
                api?.consts.elections ||
                api?.consts.phragmenElection ||
                api?.consts.electionsPhragmen
              )?.termDuration,
            ],
            [
              "Democracy",
              "democracyLaunch",
              api?.consts.democracy?.launchPeriod,
            ],
            [
              "Parachain",
              "parachainLease",
              api?.consts.slots?.leasePeriod,
              BN_ONE,
              api?.consts.slots?.leaseOffset,
            ],
            [
              "Society",
              "societyChallenge",
              api?.consts.society?.challengePeriod,
            ],
            ["Society", "societyRotate", api?.consts.society?.rotationPeriod],
            ["Treasury", "treasurySpend", api?.consts.treasury?.spendPeriod],
          ]),
        ),
      );
  }, [api, bestNumber, blockTime]);

  return state.map((item) => ({
    type: item.type,
    category: item.category,
    subCategory: item.subCategory,
    info: item.info?.toString(),
    indexer: {
      blockTime: item.dateTime,
      blockHeight: item.blockNumber.toNumber(),
    },
  }));
}

export default useScheduled;
