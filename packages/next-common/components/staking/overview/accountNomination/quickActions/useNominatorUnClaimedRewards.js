import { useEffect, useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";

const PERBILL = 1_000_000_000n;

async function findNominatorStake(
  api,
  era,
  validator,
  nominatorAddress,
  pageCount,
) {
  for (let page = 0; page < (pageCount || 1); page++) {
    const exposure = await api.query.staking.erasStakersPaged(
      era,
      validator,
      page,
    );

    const exposureJson = exposure.toJSON();
    const nominator = exposureJson.others?.find(
      (n) => n.who === nominatorAddress,
    );

    if (nominator) {
      return {
        stake: BigInt(nominator.value),
        page,
      };
    }
  }

  return null;
}

async function calculateValidatorReward(
  api,
  era,
  validator,
  nominatorAddress,
  totalEraReward,
  validatorPoints,
  totalPoints,
  validatorPrefsJson,
  overviewJson,
  claimedPages = [],
) {
  const validatorTotalPayout = (totalEraReward * validatorPoints) / totalPoints;
  const commissionPerbill = BigInt(validatorPrefsJson.commission);
  const commissionPayout = (validatorTotalPayout * commissionPerbill) / PERBILL;
  const leftoverPayout = validatorTotalPayout - commissionPayout;

  const totalStake = BigInt(overviewJson.total);
  const pageCount = overviewJson.pageCount || 0;

  const nominatorStake = await findNominatorStake(
    api,
    era,
    validator,
    nominatorAddress,
    pageCount,
  );

  if (!nominatorStake || nominatorStake.stake === 0n) {
    return null;
  }

  // Check if the page containing this nominator has already been claimed
  if (claimedPages.includes(nominatorStake.page)) {
    return null;
  }

  const reward = (leftoverPayout * nominatorStake.stake) / totalStake;

  return {
    era,
    validator,
    reward: reward.toString(),
    page: nominatorStake.page,
  };
}

async function getNominatorValidators(api, nominatorAddress) {
  const nominatorInfo = await api.query.staking.nominators(nominatorAddress);

  if (!nominatorInfo.isSome) {
    return [];
  }

  const nominatorJson = nominatorInfo.unwrap().toJSON();
  return nominatorJson.targets || [];
}

async function checkUnclaimedRewards(api, eras, validators) {
  const checkQueries = [];
  const checkQueryMap = [];

  for (const era of eras) {
    for (const validator of validators) {
      checkQueries.push(
        api.query.staking.erasStakersOverview(era, validator),
        api.query.staking.claimedRewards(era, validator),
      );
      checkQueryMap.push({ era, validator });
    }
  }

  const checkResults = await Promise.all(checkQueries);
  const unclaimedMap = new Map();
  const overviewCache = new Map();
  const claimedRewardsCache = new Map();

  for (let i = 0; i < checkQueryMap.length; i++) {
    const { era, validator } = checkQueryMap[i];
    const baseIdx = i * 2;
    const overview = checkResults[baseIdx];
    const claimedRewards = checkResults[baseIdx + 1];

    if (!overview.isSome) {
      continue;
    }

    const overviewData = overview.unwrap();
    const pageCount = overviewData.pageCount?.toNumber() || 1;
    const claimedPages = claimedRewards.toJSON();
    const claimedCount = claimedPages ? claimedPages.length : 0;

    if (claimedCount < pageCount) {
      if (!unclaimedMap.has(era)) {
        unclaimedMap.set(era, new Set());
      }
      unclaimedMap.get(era).add(validator);

      const cacheKey = `${era}-${validator}`;
      overviewCache.set(cacheKey, overview);
      claimedRewardsCache.set(cacheKey, claimedPages || []);
    }
  }

  return { unclaimedMap, overviewCache, claimedRewardsCache };
}

async function batchQueryEraRewards(api, eras) {
  const rewardQueries = eras.map((era) =>
    api.query.staking.erasValidatorReward(era),
  );
  const pointsQueries = eras.map((era) =>
    api.query.staking.erasRewardPoints(era),
  );

  const [rewardResults, pointsResults] = await Promise.all([
    Promise.all(rewardQueries),
    Promise.all(pointsQueries),
  ]);

  return { rewardResults, pointsResults };
}

async function batchQueryValidatorPrefs(api, unclaimedMap) {
  const validatorQueries = [];
  const queryMap = [];

  for (const [era, validators] of unclaimedMap.entries()) {
    for (const validator of validators) {
      validatorQueries.push(
        api.query.staking.erasValidatorPrefs(era, validator),
      );
      queryMap.push({ era, validator });
    }
  }

  const validatorResults = await Promise.all(validatorQueries);
  return { validatorResults, queryMap };
}

async function calculateAllErasRewardsBatch(api, nominatorAddress) {
  const currentEraOpt = await api.query.staking.currentEra();
  if (!currentEraOpt.isSome) {
    return { result: [], totalRewards: "0", details: [] };
  }

  const currentEra = currentEraOpt.unwrap().toNumber();
  const historyDepth = api.consts.staking.historyDepth.toNumber();
  const startEra = Math.max(0, currentEra - historyDepth + 1);

  const validators = await getNominatorValidators(api, nominatorAddress);
  if (validators.length === 0) {
    return { result: [], totalRewards: "0", details: [] };
  }

  const allEras = [];
  for (let era = startEra; era <= currentEra; era++) {
    allEras.push(era);
  }

  const { unclaimedMap, overviewCache, claimedRewardsCache } =
    await checkUnclaimedRewards(api, allEras, validators);

  const eras = Array.from(unclaimedMap.keys()).sort((a, b) => a - b);
  if (eras.length === 0) {
    return { result: [], totalRewards: "0", details: [] };
  }

  const { rewardResults, pointsResults } = await batchQueryEraRewards(
    api,
    eras,
  );
  const { validatorResults, queryMap } = await batchQueryValidatorPrefs(
    api,
    unclaimedMap,
  );

  const eraResults = [];

  for (let eraIdx = 0; eraIdx < eras.length; eraIdx++) {
    const era = eras[eraIdx];
    const eraReward = rewardResults[eraIdx];

    if (!eraReward.isSome) {
      continue;
    }

    const totalEraReward = BigInt(eraReward.unwrap().toString());
    const rewardPointsJson = pointsResults[eraIdx].toJSON();
    const totalPoints = BigInt(rewardPointsJson.total);
    let eraTotal = 0n;

    const validatorsToProcess = Array.from(unclaimedMap.get(era) || []);

    for (const validator of validatorsToProcess) {
      const queryIdx = queryMap.findIndex(
        (q) => q.era === era && q.validator === validator,
      );

      if (queryIdx === -1) continue;

      const validatorPoints = rewardPointsJson.individual[validator];
      if (!validatorPoints || validatorPoints === 0) {
        continue;
      }

      const cacheKey = `${era}-${validator}`;
      const overview = overviewCache.get(cacheKey);
      const claimedPages = claimedRewardsCache.get(cacheKey) || [];

      if (!overview || !overview.isSome) {
        continue;
      }

      try {
        const reward = await calculateValidatorReward(
          api,
          era,
          validator,
          nominatorAddress,
          totalEraReward,
          BigInt(validatorPoints),
          totalPoints,
          validatorResults[queryIdx].toJSON(),
          overview.unwrap().toJSON(),
          claimedPages,
        );

        if (reward && BigInt(reward.reward) > 0n) {
          eraTotal += BigInt(reward.reward);

          if (!eraResults.find((r) => r.era === era)) {
            eraResults.push({
              era,
              unClaimedRewards: "0",
              validators: [],
            });
          }

          const eraResult = eraResults.find((r) => r.era === era);
          eraResult.validators.push({
            validatorId: validator,
            reward: reward.reward,
            page: reward.page,
          });
        }
      } catch (error) {
        continue;
      }
    }

    if (eraTotal > 0n) {
      const eraResult = eraResults.find((r) => r.era === era);
      if (eraResult) {
        eraResult.unClaimedRewards = eraTotal.toString();
      }
    }
  }

  const totalRewards = eraResults.reduce(
    (sum, item) => sum + BigInt(item.unClaimedRewards),
    0n,
  );

  const details = eraResults.flatMap((eraResult) =>
    eraResult.validators.map((v) => ({
      era: eraResult.era,
      validatorId: v.validatorId,
      page: v.page,
    })),
  );

  return {
    result: eraResults,
    totalRewards: totalRewards.toString(),
    details,
  };
}

export default function useNominatorUnClaimedRewards(nominatorAddress) {
  const api = useContextApi();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!api || !nominatorAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await calculateAllErasRewardsBatch(api, nominatorAddress);
      setResult(data);
    } catch (error) {
      setResult({ result: [], totalRewards: "0", details: [] });
    } finally {
      setLoading(false);
    }
  }, [api, nominatorAddress]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { result, loading, fetch };
}
