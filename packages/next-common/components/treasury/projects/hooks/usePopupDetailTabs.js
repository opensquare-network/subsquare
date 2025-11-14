import { useMemo } from "react";
import ProjectProposalsList from "../projectDetailPopup/proposalsList";
import ProjectSpendsList from "../projectDetailPopup/spendsList";
import useProposals from "./useProposals";
import useSpends from "./useSpends";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export const TAB_VALUES = {
  proposals: "proposals",
  spends: "spends",
};

export default function usePopupDetailTabs({ proposalList, spendList }) {
  const { proposalIndexes, spendIndexes } = useFormatIndexes({
    proposalList,
    spendList,
  });

  const { proposals, loading: proposalsLoading } =
    useProposals(proposalIndexes);
  const { spends, loading: spendsLoading } = useSpends(spendIndexes);

  const normalizedProposals = useMemo(
    () => normalizeProposals(proposals, proposalList),
    [proposals, proposalList],
  );

  const normalizedSpends = useMemo(
    () => normalizeSpends(spends, spendList),
    [spends, spendList],
  );

  const tabs = useMemo(
    () => [
      {
        value: TAB_VALUES.proposals,
        label: "Proposals",
        activeCount: normalizedProposals?.length,
        content: (
          <ProjectProposalsList
            proposals={normalizedProposals}
            loading={proposalsLoading}
            proposalList={proposalList}
          />
        ),
      },
      {
        value: TAB_VALUES.spends,
        label: "Spends",
        activeCount: normalizedSpends?.length,
        content: (
          <ProjectSpendsList
            spends={normalizedSpends}
            loading={spendsLoading}
            spendList={spendList}
          />
        ),
      },
    ],
    [
      normalizedProposals,
      normalizedSpends,
      proposalsLoading,
      spendsLoading,
      proposalList,
      spendList,
    ],
  );

  return {
    tabs,
    proposals: normalizedProposals,
    spends: normalizedSpends,
    proposalsLoading,
    spendsLoading,
    proposalIndexes,
    spendIndexes,
  };
}

function normalizeProposals(proposals, proposalList) {
  const proportionMap = new Map(proposalList.map((p) => [p.id, p.proportion]));
  return proposals.map((proposal) => {
    const proportion = proportionMap.get(proposal.proposalIndex) ?? 1;
    const { submission: submissionPrice, final: finalPrice } =
      proposal.onchainData?.price ?? {};
    const value = BigNumber(proposal.dValue);
    const fiatAtSubmission = value.times(submissionPrice).toFixed(2);
    const fiatAtFinal = value.times(finalPrice).toFixed(2);

    return {
      ...proposal,
      proportion,
      fiatAtSubmission,
      fiatAtFinal,
    };
  });
}

function normalizeSpends(spends, spendList) {
  const proportionMap = new Map(spendList.map((s) => [s.id, s.proportion]));
  return spends.map((spend) => {
    const proportion = proportionMap.get(spend.index) ?? 1;
    const { fiatAtSubmission, fiatAtFinal } = getSpendAmount(
      spend?.onchainData,
    );
    return {
      ...spend,
      proportion,
      fiatAtSubmission,
      fiatAtFinal,
    };
  });
}

function useFormatIndexes({ proposalList, spendList }) {
  return useMemo(() => {
    return {
      proposalIndexes: proposalList.map((proposal) => proposal.id),
      spendIndexes: spendList.map((spend) => spend.id),
    };
  }, [proposalList, spendList]);
}

function getSpendAmount(spend) {
  const { decimals } = getChainSettings(CHAIN);
  const { assetKind, amount } = spend?.extracted ?? {};
  const { submission: submissionPrice, final: finalPrice } = spend?.price ?? {};

  let fiatAtSubmission = BigNumber(0);
  let fiatAtFinal = BigNumber(0);
  const nativeAccuracy = Math.pow(10, decimals);

  if (assetKind?.type === "native") {
    fiatAtSubmission = BigNumber(toPrecision(amount, decimals))
      .times(submissionPrice)
      .dividedBy(nativeAccuracy);
    fiatAtFinal = BigNumber(toPrecision(amount, decimals))
      .times(finalPrice)
      .dividedBy(nativeAccuracy);
  } else if (SYMBOL_DECIMALS[assetKind?.symbol]) {
    const amountInFiat = BigNumber(
      toPrecision(amount, SYMBOL_DECIMALS[assetKind?.symbol]),
    );
    fiatAtSubmission = amountInFiat;
    fiatAtFinal = amountInFiat;
  }
  return {
    fiatAtSubmission: fiatAtSubmission.toFixed(2),
    fiatAtFinal: fiatAtFinal.toFixed(2),
  };
}
