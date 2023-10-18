import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import FoldableSections from "next-common/components/setting/notification/foldableSections";
import useTreasuryChildBountyOptions from "next-common/components/setting/notification/useTreasuryChildBountyOptions";
import useTreasuryBountyOptions from "next-common/components/setting/notification/useTreasuryBountyOptions";
import useTreasuryTipOptions from "next-common/components/setting/notification/useTreasuryTipOptions";
import useTreasuryProposalOptions from "next-common/components/setting/notification/useTreasuryProposalOptions";

export default function useTreasurySubscription(
  subscription,
  saving,
  disabled,
) {
  const homeMenus = getHomeMenu();

  const { hasMenu: hasTreasury, menu: treasuryMenu } = checkSubMenu(
    homeMenus,
    "TREASURY",
  );
  const { hasMenu: hasTreasuryProposal } = checkSubMenu(
    treasuryMenu?.items,
    "Proposals",
  );
  const { hasMenu: hasTreasuryTip } = checkSubMenu(treasuryMenu?.items, "Tips");
  const { hasMenu: hasTreasuryBounty } = checkSubMenu(
    treasuryMenu?.items,
    "Bounties",
  );
  const { hasMenu: hasTreasuryChildBounty } = checkSubMenu(
    treasuryMenu?.items,
    "Child Bounties",
  );

  const {
    treasuryProposalOptionsComponent,
    getTreasuryProposalOptionValues,
    isChanged: isTreasuryProposalOptionsChanged,
  } = useTreasuryProposalOptions({
    disabled,
    saving,
    treasuryProposalProposed: subscription?.treasuryProposalProposed,
    treasuryProposalApproved: subscription?.treasuryProposalApproved,
    treasuryProposalAwarded: subscription?.treasuryProposalAwarded,
    treasuryProposalRejected: subscription?.treasuryProposalRejected,
  });

  const {
    treasuryTipOptionsComponent,
    getTreasuryTipOptionValues,
    isChanged: isTreasuryTipOptionsChanged,
  } = useTreasuryTipOptions({
    disabled,
    saving,
    treasuryTipNew: subscription?.treasuryTipNew,
    treasuryTipTip: subscription?.treasuryTipTip,
    treasuryTipClosed: subscription?.treasuryTipClosed,
    treasuryTipRetracted: subscription?.treasuryTipRetracted,
  });

  const {
    treasuryBountyOptionsComponent,
    getTreasuryBountyOptionValues,
    isChanged: isTreasuryBountyOptionsChanged,
  } = useTreasuryBountyOptions({
    disabled,
    saving,
    treasuryBountyProposed: subscription?.treasuryBountyProposed,
    treasuryBountyAwarded: subscription?.treasuryBountyAwarded,
    treasuryBountyApproved: subscription?.treasuryBountyApproved,
    treasuryBountyCanceled: subscription?.treasuryBountyCanceled,
    treasuryBountyClaimed: subscription?.treasuryBountyClaimed,
    treasuryBountyRejected: subscription?.treasuryBountyRejected,
  });

  const {
    treasuryChildBountyOptionsComponent,
    getTreasuryChildBountyOptionValues,
    isChanged: isTreasuryChildBountyOptionsChanged,
  } = useTreasuryChildBountyOptions({
    disabled,
    saving,
    treasuryChildBountyAdded: subscription?.treasuryChildBountyAdded,
    treasuryChildBountyAwarded: subscription?.treasuryChildBountyAwarded,
    treasuryChildBountyCanceled: subscription?.treasuryChildBountyCanceled,
    treasuryChildBountyClaimed: subscription?.treasuryChildBountyClaimed,
  });

  let treasuryOptions = null;
  if (
    hasTreasury &&
    (hasTreasuryProposal ||
      hasTreasuryTip ||
      hasTreasuryBounty ||
      hasTreasuryChildBounty)
  ) {
    treasuryOptions = (
      <FoldableSections title="Treasury">
        {hasTreasuryProposal && treasuryProposalOptionsComponent}
        {hasTreasuryTip && treasuryTipOptionsComponent}
        {hasTreasuryBounty && treasuryBountyOptionsComponent}
        {hasTreasuryChildBounty && treasuryChildBountyOptionsComponent}
      </FoldableSections>
    );
  }

  return {
    treasuryOptions,
    isTreasuryOptionsChanged:
      isTreasuryProposalOptionsChanged ||
      isTreasuryTipOptionsChanged ||
      isTreasuryBountyOptionsChanged ||
      isTreasuryChildBountyOptionsChanged,
    getTreasuryOptionValues: () => {
      if (!hasTreasury) {
        return {};
      }
      return {
        ...(hasTreasuryProposal && getTreasuryProposalOptionValues()),
        ...(hasTreasuryTip && getTreasuryTipOptionValues()),
        ...(hasTreasuryBounty && getTreasuryBountyOptionValues()),
        ...(hasTreasuryChildBounty && getTreasuryChildBountyOptionValues()),
      };
    },
  };
}
