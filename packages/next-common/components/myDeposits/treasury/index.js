import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import { sum } from "lodash-es";
import { useDepositTreasuryBountiesTab } from "./bounties";
import { useDepositTreasuryProposalsTab } from "./proposals";
import { useDepositTreasuryTipsTab } from "./tips";
import { useChainSettings } from "next-common/context/chain";
import { useSelector } from "react-redux";
import {
  myTreasuryBountyBondsSelector,
  myTreasuryBountyCuratorDepositsSelector,
  myTreasuryProposalDepositsSelector,
  myTreasuryTipDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";

export function useMyDepositTreasury() {
  const proposalDeposits = useSelector(myTreasuryProposalDepositsSelector);
  const proposals = useDepositTreasuryProposalsTab(proposalDeposits);

  const bountyBonds = useSelector(myTreasuryBountyBondsSelector);
  const bountyCuratorDeposits = useSelector(
    myTreasuryBountyCuratorDepositsSelector,
  );
  const bounties = useDepositTreasuryBountiesTab(
    bountyBonds,
    bountyCuratorDeposits,
  );

  const tipDeposits = useSelector(myTreasuryTipDepositsSelector);
  const tips = useDepositTreasuryTipsTab(tipDeposits);
  const {
    modules: { treasury },
  } = useChainSettings();
  const hasTreasuryTips = !!treasury?.tips && !treasury?.tips?.archived;

  let loading = proposals.loading || bounties.loading;
  let activeCount = sum([proposals.activeCount, bounties.activeCount]);
  if (hasTreasuryTips) {
    activeCount += tips.activeCount;
    loading = loading || tips.loading;
  }

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  const items = [proposals, bounties, tips];
  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
