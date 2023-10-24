import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import useTreasuryChildBountyOptions from "next-common/components/setting/notification/useTreasuryChildBountyOptions";
import useTreasuryBountyOptions from "next-common/components/setting/notification/useTreasuryBountyOptions";
import useTreasuryTipOptions from "next-common/components/setting/notification/useTreasuryTipOptions";
import useTreasuryProposalOptions from "next-common/components/setting/notification/useTreasuryProposalOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/treasury";

export default function useTreasurySubscription(subscription, disabled) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasTreasury, menu: treasuryMenu } = checkSubMenu(
    homeMenus,
    Names.treasury,
  );
  const { isMenuActive: hasTreasuryProposal } = checkSubMenu(
    treasuryMenu?.items,
    Names.proposals,
  );
  const { isMenuActive: hasTreasuryTip } = checkSubMenu(
    treasuryMenu?.items,
    Names.tips,
  );
  const { isMenuActive: hasTreasuryBounty } = checkSubMenu(
    treasuryMenu?.items,
    Names.bounties,
  );
  const { isMenuActive: hasTreasuryChildBounty } = checkSubMenu(
    treasuryMenu?.items,
    Names.childBounties,
  );

  const {
    treasuryProposalOptionsComponent,
    getTreasuryProposalOptionValues,
    isChanged: isTreasuryProposalOptionsChanged,
  } = useTreasuryProposalOptions({
    disabled,
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
      <AccordionCard title="Treasury" defaultOpen={true}>
        <Options>
          {hasTreasuryProposal && treasuryProposalOptionsComponent}
          {hasTreasuryTip && treasuryTipOptionsComponent}
          {hasTreasuryBounty && treasuryBountyOptionsComponent}
          {hasTreasuryChildBounty && treasuryChildBountyOptionsComponent}
        </Options>
      </AccordionCard>
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
