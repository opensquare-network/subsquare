import { useMemo } from "react";
import ProjectProposalsList from "../projectDetailPopup/proposalsList";
import ProjectSpendsList from "../projectDetailPopup/spendsList";
import ProjectChildBountiesList from "../projectDetailPopup/childBountiesList";
import ProjectTipsList from "../projectDetailPopup/tipsList";
import useTreasuryItems from "./useTreasuryItems";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeMultiAssetBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeMultiAssetBountyListItem";
import ProjectBountiesList from "../projectDetailPopup/bountiesList";
import ProjectMultiAssetBountiesList from "../projectDetailPopup/multiAssetBountiesList";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

const STABLECOIN_SYMBOLS = new Set(["USDC", "USDT", "HOLLAR"]);

export const TAB_VALUES = {
  proposals: "proposals",
  spends: "spends",
  childBounties: "childBounties",
  tips: "tips",
  bounties: "bounties",
  multiAssetBounties: "multiAssetBounties",
};

export default function usePopupDetailTabs({
  proposalList,
  spendList,
  childBountyList,
  tipList,
  bountyList,
  multiAssetBountyList,
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
  const normalizedTipList = useMemo(() => tipList ?? [], [tipList]);
  const normalizedBountyList = useMemo(() => bountyList ?? [], [bountyList]);
  const normalizedMultiAssetBountyList = useMemo(
    () => multiAssetBountyList ?? [],
    [multiAssetBountyList],
  );

  const {
    proposalIndexes,
    spendIndexes,
    childBountyIndexes,
    tipIndexes,
    bountyIndexes,
    multiAssetBountyIndexes,
  } = useFormatIndexes({
    proposalList: normalizedProposalList,
    spendList: normalizedSpendList,
    childBountyList: normalizedChildBountyList,
    tipList: normalizedTipList,
    bountyList: normalizedBountyList,
    multiAssetBountyList: normalizedMultiAssetBountyList,
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

  const { items: tips, loading: tipsLoading } = useTreasuryItems({
    indexes: tipIndexes,
    apiPath: "/treasury/tips",
    normalizeItem: normalizeTipListItem,
  });

  const { items: bounties, loading: bountiesLoading } = useTreasuryItems({
    indexes: bountyIndexes,
    apiPath: "/treasury/bounties",
    normalizeItem: normalizeBountyListItem,
  });

  const {
    items: multiAssetBounties,
    loading: multiAssetBountiesLoading,
  } = useTreasuryItems({
    indexes: multiAssetBountyIndexes,
    apiPath: "/treasury/multi-asset-bounties",
    normalizeItem: normalizeMultiAssetBountyListItem,
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

  const normalizedTips = useMemo(
    () => normalizeTips(tips, normalizedTipList),
    [tips, normalizedTipList],
  );

  const normalizedBounties = useMemo(
    () =>
      normalizeItemsWithPrice(
        bounties,
        normalizedBountyList,
        (bounty) => bounty.bountyIndex,
      ),
    [bounties, normalizedBountyList],
  );

  const normalizedMultiAssetBounties = useMemo(
    () =>
      normalizeMultiAssetBounties(
        multiAssetBounties,
        normalizedMultiAssetBountyList,
      ),
    [multiAssetBounties, normalizedMultiAssetBountyList],
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
        normalizedTipList?.length > 0 && {
          value: TAB_VALUES.tips,
          label: "Tips",
          activeCount: normalizedTipList?.length,
          content: (
            <ProjectTipsList tips={normalizedTips} loading={tipsLoading} />
          ),
        },
        normalizedBountyList?.length > 0 && {
          value: TAB_VALUES.bounties,
          label: "Bounties",
          activeCount: normalizedBountyList.length,
          content: (
            <ProjectBountiesList
              bounties={normalizedBounties}
              loading={bountiesLoading}
            />
          ),
        },
        normalizedMultiAssetBountyList?.length > 0 && {
          value: TAB_VALUES.multiAssetBounties,
          label: "Multi-Asset Bounties",
          activeCount: normalizedMultiAssetBountyList.length,
          content: (
            <ProjectMultiAssetBountiesList
              bounties={normalizedMultiAssetBounties}
              loading={multiAssetBountiesLoading}
            />
          ),
        },
      ].filter(Boolean),
    [
      normalizedProposals,
      normalizedSpends,
      normalizedChildBounties,
      normalizedTips,
      normalizedProposalList,
      normalizedSpendList,
      normalizedChildBountyList,
      proposalsLoading,
      spendsLoading,
      childBountiesLoading,
      normalizedTipList,
      tipsLoading,
      normalizedBountyList,
      normalizedBounties,
      bountiesLoading,
      normalizedMultiAssetBountyList,
      normalizedMultiAssetBounties,
      multiAssetBountiesLoading,
    ],
  );

  return {
    tabs,
    // list
    proposals: normalizedProposals,
    spends: normalizedSpends,
    childBounties: normalizedChildBounties,
    tips: normalizedTips,
    bounties: normalizedBounties,
    multiAssetBounties: normalizedMultiAssetBounties,
    // indexes
    proposalIndexes,
    spendIndexes,
    childBountyIndexes,
    tipIndexes,
    bountyIndexes,
    multiAssetBountyIndexes,
    // loading
    proposalsLoading,
    spendsLoading,
    childBountiesLoading,
    tipsLoading,
    bountiesLoading,
    multiAssetBountiesLoading,
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
    const {
      submission: submissionPrice,
      final: finalPrice,
      current: currentPrice,
    } = item.onchainData?.price ?? {};
    const value = BigNumber(item.dValue);
    const fiatAtSubmission = value.times(submissionPrice).toFixed(2);
    const fiatAtFinal = value.times(finalPrice ?? currentPrice).toFixed(2);

    return {
      ...item,
      proportion,
      fiatAtSubmission,
      fiatAtFinal,
    };
  });
}

function normalizeMultiAssetBounties(items, itemList) {
  if (!items) {
    return items;
  }

  const proportionMap = new Map(
    itemList?.map((item) => [item.id, item.proportion]),
  );

  return items.map((item) => {
    const proportion = proportionMap.get(item.bountyIndex) ?? 1;
    const fiatAtFinal = getMultiAssetBountyFiatValue(item);

    return {
      ...item,
      proportion,
      fiatAtFinal,
    };
  });
}

function getMultiAssetBountyFiatValue(item) {
  const { assetKind, price } = item.onchainData ?? {};
  const chainSettings = getChainSettings(CHAIN);
  const { symbol, decimals, assetType } = getAssetInfoFromAssetKind(
    assetKind,
    chainSettings.decimals,
    chainSettings.symbol,
  );
  const amount = BigNumber(toPrecision(item.onchainData?.value ?? 0, decimals));

  if (STABLECOIN_SYMBOLS.has(symbol)) {
    return amount.toFixed(2);
  }

  if (assetType === "native" || assetType === "crosschainNative") {
    return amount
      .times(price?.final ?? price?.current ?? 0)
      .toFixed(2);
  }

  return "0";
}

function normalizeChildBounties(childBounties, childBountyList) {
  return normalizeItemsWithPrice(
    childBounties,
    childBountyList,
    (childBounty) => childBounty.id,
  );
}

function normalizeTips(tips, tipList) {
  return normalizeItemsWithPrice(tips, tipList, (tip) => tip.hash);
}

function normalizeProposals(proposals, proposalList = []) {
  return normalizeItemsWithPrice(
    proposals,
    proposalList,
    (proposal) => proposal.proposalIndex,
  );
}

function normalizeSpends(spends, spendList = []) {
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
  proposalList,
  spendList,
  childBountyList,
  tipList,
  bountyList,
  multiAssetBountyList,
}) {
  return useMemo(() => {
    return {
      proposalIndexes: proposalList?.map((proposal) => proposal.id),
      spendIndexes: spendList?.map((spend) => spend.id),
      childBountyIndexes: childBountyList?.map((childBounty) => childBounty.id),
      tipIndexes: tipList?.map((tip) => tip.hash),
      bountyIndexes: bountyList?.map((bounty) => bounty.id ?? bounty.bountyIndex),
      multiAssetBountyIndexes: multiAssetBountyList?.map(
        (bounty) => bounty.id ?? bounty.bountyIndex,
      ),
    };
  }, [
    proposalList,
    spendList,
    childBountyList,
    tipList,
    bountyList,
    multiAssetBountyList,
  ]);
}

function getSpendAmount(spend) {
  const { decimals } = getChainSettings(CHAIN);
  const { assetKind, amount } = spend?.extracted ?? {};
  const {
    submission: submissionPrice,
    final: finalPrice,
    current: currentPrice,
  } = spend?.price ?? {};

  let fiatAtSubmission = BigNumber(0);
  let fiatAtFinal = BigNumber(0);

  if (assetKind?.type === "native") {
    fiatAtSubmission = BigNumber(toPrecision(amount, decimals)).times(
      submissionPrice,
    );
    fiatAtFinal = BigNumber(toPrecision(amount, decimals)).times(
      finalPrice ?? currentPrice,
    );
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
