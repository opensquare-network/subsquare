import { useMemo } from "react";
import ProjectProposalsList from "../projectDetailPopup/proposalsList";
import ProjectSpendsList from "../projectDetailPopup/spendsList";
import ProjectChildBountiesList from "../projectDetailPopup/childBountiesList";
import useProposals from "./useProposals";
import useSpends from "./useSpends";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import useChildBounties from "./usechildBounties";

export const TAB_VALUES = {
  proposals: "proposals",
  spends: "spends",
  childBounties: "childBounties",
};

export default function usePopupDetailTabs({
  proposalList,
  spendList,
  childBountyList,
}) {
  const { proposalIndexes, spendIndexes, childBountyIndexes } =
    useFormatIndexes({
      proposalList,
      spendList,
      childBountyList,
    });

  const { proposals, loading: proposalsLoading } =
    useProposals(proposalIndexes);
  const { spends, loading: spendsLoading } = useSpends(spendIndexes);
  const { childBounties, loading: childBountiesLoading } =
    useChildBounties(childBountyIndexes);

  const normalizedProposals = useMemo(
    () => normalizeProposals(proposals, proposalList),
    [proposals, proposalList],
  );

  const normalizedSpends = useMemo(
    () => normalizeSpends(spends, spendList),
    [spends, spendList],
  );

  const normalizedChildBounties = useMemo(
    () => normalizeChildBounties(childBounties, childBountyList),
    [childBounties, childBountyList],
  );

  const tabs = useMemo(
    () => [
      {
        value: TAB_VALUES.spends,
        label: "Spends",
        activeCount: normalizedSpends?.length,
        content: (
          <ProjectSpendsList
            spends={normalizedSpends}
            loading={spendsLoading}
          />
        ),
      },
      {
        value: TAB_VALUES.proposals,
        label: "Proposals",
        activeCount: normalizedProposals?.length,
        content: (
          <ProjectProposalsList
            proposals={normalizedProposals}
            loading={proposalsLoading}
          />
        ),
      },
      {
        value: TAB_VALUES.childBounties,
        label: "Child Bounties",
        activeCount: normalizedChildBounties?.length,
        content: (
          <ProjectChildBountiesList
            childBounties={normalizedChildBounties}
            loading={childBountiesLoading}
          />
        ),
      },
    ],
    [
      normalizedProposals,
      normalizedSpends,
      normalizedChildBounties,
      proposalsLoading,
      spendsLoading,
      childBountiesLoading,
    ],
  );

  return {
    tabs,
    // list
    proposals: normalizedProposals,
    spends: normalizedSpends,
    childBounties: normalizedChildBounties,
    // indexes
    proposalIndexes,
    spendIndexes,
    childBountyIndexes,
    // loading
    proposalsLoading,
    spendsLoading,
    childBountiesLoading,
  };
}

function normalizeChildBounties(childBounties, childBountyList) {
  const proportionMap = new Map(
    childBountyList?.map((c) => [c.id, c.proportion]),
  );
  return childBounties?.map((childBounty) => {
    const proportion = proportionMap.get(childBounty.id) ?? 1;
    const { submission: submissionPrice, final: finalPrice } =
      childBounty.onchainData?.price ?? {};
    const value = BigNumber(childBounty.dValue);
    const fiatAtSubmission = value.times(submissionPrice).toFixed(2);
    const fiatAtFinal = value.times(finalPrice).toFixed(2);

    return {
      ...childBounty,
      proportion,
      fiatAtSubmission,
      fiatAtFinal,
    };
  });
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

function useFormatIndexes({
  proposalList = [],
  spendList = [],
  childBountyList = [],
}) {
  return useMemo(() => {
    return {
      proposalIndexes: proposalList.map((proposal) => proposal.id),
      spendIndexes: spendList.map((spend) => spend.id),
      childBountyIndexes: childBountyList.map((childBounty) => childBounty.id),
    };
  }, [proposalList, spendList, childBountyList]);
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
