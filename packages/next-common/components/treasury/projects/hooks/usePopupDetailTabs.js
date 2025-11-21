import { useMemo } from "react";
import ProjectProposalsList from "../projectDetailPopup/proposalsList";
import ProjectSpendsList from "../projectDetailPopup/spendsList";
import ProjectChildBountiesList from "../projectDetailPopup/childBountiesList";
import useTreasuryItems from "./useTreasuryItems";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

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
  const normalizedProposalList = useMemo(
    () => proposalList ?? [],
    [proposalList],
  );
  const normalizedSpendList = useMemo(() => spendList ?? [], [spendList]);
  const normalizedChildBountyList = useMemo(
    () => childBountyList ?? [],
    [childBountyList],
  );

  const { proposalIndexes, spendIndexes, childBountyIndexes } =
    useFormatIndexes({
      proposalList: normalizedProposalList,
      spendList: normalizedSpendList,
      childBountyList: normalizedChildBountyList,
    });

  const { items: proposals, loading: proposalsLoading } = useTreasuryItems({
    indexes: proposalIndexes,
    apiPath: "/treasury/proposals",
    normalizeItem: normalizeTreasuryProposalListItem,
  });

  const { items: spends, loading: spendsLoading } = useTreasuryItems({
    indexes: spendIndexes,
    apiPath: "/treasury/spends",
    normalizeItem: normalizeTreasurySpendListItem,
  });

  const { items: childBounties, loading: childBountiesLoading } =
    useTreasuryItems({
      indexes: childBountyIndexes,
      apiPath: "/treasury/child-bounties",
      normalizeItem: normalizeChildBountyListItem,
    });

  const normalizedProposals = useMemo(
    () => normalizeProposals(proposals, normalizedProposalList),
    [proposals, normalizedProposalList],
  );

  const normalizedSpends = useMemo(
    () => normalizeSpends(spends, normalizedSpendList),
    [spends, normalizedSpendList],
  );

  const normalizedChildBounties = useMemo(
    () => normalizeChildBounties(childBounties, normalizedChildBountyList),
    [childBounties, normalizedChildBountyList],
  );

  const tabs = useMemo(
    () =>
      [
        normalizedSpendList?.length > 0 && {
          value: TAB_VALUES.spends,
          label: "Spends",
          activeCount: normalizedSpendList?.length,
          content: (
            <ProjectSpendsList
              spends={normalizedSpends}
              loading={spendsLoading}
            />
          ),
        },
        normalizedProposalList?.length > 0 && {
          value: TAB_VALUES.proposals,
          label: "Proposals",
          activeCount: normalizedProposalList?.length,
          content: (
            <ProjectProposalsList
              proposals={normalizedProposals}
              loading={proposalsLoading}
            />
          ),
        },
        normalizedChildBountyList?.length > 0 && {
          value: TAB_VALUES.childBounties,
          label: "Child Bounties",
          activeCount: normalizedChildBountyList?.length,
          content: (
            <ProjectChildBountiesList
              childBounties={normalizedChildBounties}
              loading={childBountiesLoading}
            />
          ),
        },
      ].filter(Boolean),
    [
      normalizedProposals,
      normalizedSpends,
      normalizedChildBounties,
      normalizedProposalList,
      normalizedSpendList,
      normalizedChildBountyList,
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

function normalizeItemsWithPrice(items, itemList, getItemId) {
  if (!items) {
    return items;
  }
  const proportionMap = new Map(
    itemList?.map((item) => [item.id, item.proportion]),
  );
  return items.map((item) => {
    const proportion = proportionMap.get(getItemId(item)) ?? 1;
    const { submission: submissionPrice, final: finalPrice } =
      item.onchainData?.price ?? {};
    const value = BigNumber(item.dValue);
    const fiatAtSubmission = value.times(submissionPrice).toFixed(2);
    const fiatAtFinal = value.times(finalPrice).toFixed(2);

    return {
      ...item,
      proportion,
      fiatAtSubmission,
      fiatAtFinal,
    };
  });
}

function normalizeChildBounties(childBounties, childBountyList) {
  return normalizeItemsWithPrice(
    childBounties,
    childBountyList,
    (childBounty) => childBounty.id,
  );
}

function normalizeProposals(proposals, proposalList) {
  return normalizeItemsWithPrice(
    proposals,
    proposalList,
    (proposal) => proposal.proposalIndex,
  );
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

function useFormatIndexes({ proposalList, spendList, childBountyList }) {
  return useMemo(() => {
    return {
      proposalIndexes: proposalList?.map((proposal) => proposal.id),
      spendIndexes: spendList?.map((spend) => spend.id),
      childBountyIndexes: childBountyList?.map((childBounty) => childBounty.id),
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
