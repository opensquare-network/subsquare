import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import { useGlobalRelayChainApi } from "../useGlobalRelayChainApi";
import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";

export function getEraPerDay({ api, relayApi }) {
  const expectedBlockTime = relayApi.consts.babe.expectedBlockTime.toNumber();
  const epochDuration = relayApi.consts.babe.epochDuration.toNumber();
  const sessionsPerEra = api.consts.staking.sessionsPerEra.toNumber();

  if (epochDuration === 0 || sessionsPerEra === 0 || expectedBlockTime === 0) {
    return 0;
  }

  const DAY_MS = 86400000;
  const blocksPerEra = epochDuration * sessionsPerEra;
  const msPerEra = blocksPerEra * expectedBlockTime;
  return DAY_MS / msPerEra;
}

export async function getAverageEraValidatorReward({ api, relayApi }) {
  if (!api || !relayApi) {
    return {
      days: 0,
      reward: 0n,
    };
  }

  const erasPerDay = getEraPerDay({ api, relayApi });

  const historyDepth = api.consts.staking.historyDepth.toNumber();
  const maxSupportedDays = historyDepth === 0 ? 0 : historyDepth / erasPerDay;
  const days = maxSupportedDays > 30 ? 30 : 15;

  const activeEraOpt = await api.query.staking.activeEra();
  const activeEraIndex = activeEraOpt.toJSON()?.index;

  const endEra = Math.max(
    activeEraIndex - erasPerDay * days,
    Math.max(0, activeEraIndex - historyDepth),
  );

  const eras = [];
  let thisEra = activeEraIndex - 1;
  do {
    eras.push(thisEra.toString());
    thisEra = thisEra - 1;
  } while (thisEra >= endEra);

  const erasValidatorRewardOpt =
    await api.query.staking.erasValidatorReward.multi(
      eras.map((e) => Number(e)),
    );

  const totalReward = erasValidatorRewardOpt
    .map((v) => BigInt(v.toJSON() || 0))
    .reduce((prev, current) => prev + current, 0n);

  const reward = totalReward / BigInt(eras.length);
  return { days, reward };
}

const { useGlobalCachedFetch } = createGlobalCachedFetch();

export function useAverageRewardRate() {
  const api = useContextApi();
  const relayApi = useGlobalRelayChainApi();

  const fetchRate = useCallback(
    async (setResult) => {
      if (!api || !relayApi) {
        setResult(null);
        return;
      }

      const totalIssuanceOpt = await api.query.balances.totalIssuance();
      const totalIssuance = totalIssuanceOpt.toBigInt();
      const erasPerDay = getEraPerDay({ api, relayApi });
      const averageEraValidatorReward = await getAverageEraValidatorReward({
        api,
        relayApi,
      });

      if (
        totalIssuance === 0n ||
        erasPerDay === 0 ||
        averageEraValidatorReward.reward === 0n
      ) {
        setResult(0);
        return;
      }

      const activeEraOpt = await api.query.staking.activeEra();

      const activeEraIndex = activeEraOpt.toJSON()?.index;
      const era = Math.max(activeEraIndex - 1, 0);
      const lastTotalStakeOpt = await api.query.staking.erasTotalStake(era);

      const lastTotalStake = lastTotalStakeOpt.toBigInt();
      const supplyStaked =
        lastTotalStake === 0n || totalIssuance === 0n
          ? 0
          : Number(lastTotalStake) / Number(totalIssuance);
      const averageRewardPerDay =
        averageEraValidatorReward.reward * BigInt(erasPerDay);
      const dayRewardRate =
        totalIssuance === 0n
          ? 0
          : new BigNumber(averageRewardPerDay)
              .div(new BigNumber(totalIssuance).div(100))
              .toNumber();
      const inflationToStakers = dayRewardRate * 365;
      const rate =
        supplyStaked === 0 ? 0 : Number(inflationToStakers) / supplyStaked;

      setResult(rate);
    },
    [api, relayApi],
  );

  const { result: rate } = useGlobalCachedFetch(fetchRate, "averageRewardRate");
  return rate;
}
