import { useSelector } from "react-redux";
import { useDepositTreasuryProposalsTab } from "next-common/components/myDeposits/treasury/proposals";
import { useDepositTreasuryBountiesTab } from "next-common/components/myDeposits/treasury/bounties";
import {
  profileTreasuryBountyBondsSelector,
  profileTreasuryBountyCuratorDepositsSelector,
  profileTreasuryProposalDepositsSelector,
  profileTreasuryTipDepositsSelector,
} from "next-common/store/reducers/profile/deposits/treasury";
import { useDepositTreasuryTipsTab } from "next-common/components/myDeposits/treasury/tips";
import { useChainSettings } from "next-common/context/chain";
import { sum } from "lodash-es";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";

export default function useProfileTreasuryDepositsData() {
  const proposalDeposits = useSelector(profileTreasuryProposalDepositsSelector);
  const proposals = useDepositTreasuryProposalsTab(proposalDeposits);

  const bountyBonds = useSelector(profileTreasuryBountyBondsSelector);
  const bountyCuratorDeposits = useSelector(
    profileTreasuryBountyCuratorDepositsSelector,
  );
  const bounties = useDepositTreasuryBountiesTab(
    bountyBonds,
    bountyCuratorDeposits,
  );

  const {
    modules: { treasury },
  } = useChainSettings();
  const hasTreasuryTips = !!treasury?.tips && !treasury?.tips?.archived;

  const tipDeposits = useSelector(profileTreasuryTipDepositsSelector);
  const tips = useDepositTreasuryTipsTab(tipDeposits);

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  let activeCount = sum([proposals.activeCount, bounties.activeCount]);
  let loading = proposals.loading || bounties.loading;
  if (hasTreasuryTips) {
    activeCount += tips.activeCount;
    loading = loading || tips.loading;
  }

  const items = [proposals, bounties, tips];
  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
