import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import TreasuryChildBountyOptions from "next-common/components/setting/notification/treasuryChildBountyOptions";
import TreasuryBountyOptions from "next-common/components/setting/notification/treasuryBountyOptions";
import TreasuryTipOptions from "next-common/components/setting/notification/treasuryTipOptions";
import TreasuryProposalOptions from "next-common/components/setting/notification/treasuryProposalOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/treasury";

export default function TreasurySubscription({ subscription, disabled }) {
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

  if (
    !hasTreasury ||
    (!hasTreasuryProposal &&
      !hasTreasuryTip &&
      !hasTreasuryBounty &&
      hasTreasuryChildBounty)
  ) {
    return null;
  }

  return (
    <AccordionCard title="Treasury" defaultOpen={true}>
      <Options>
        {hasTreasuryProposal && (
          <TreasuryProposalOptions
            disabled={disabled}
            treasuryProposalProposed={subscription?.treasuryProposalProposed}
            treasuryProposalApproved={subscription?.treasuryProposalApproved}
            treasuryProposalAwarded={subscription?.treasuryProposalAwarded}
            treasuryProposalRejected={subscription?.treasuryProposalRejected}
          />
        )}
        {hasTreasuryTip && (
          <TreasuryTipOptions
            disabled={disabled}
            treasuryTipNew={subscription?.treasuryTipNew}
            treasuryTipTip={subscription?.treasuryTipTip}
            treasuryTipClosed={subscription?.treasuryTipClosed}
            treasuryTipRetracted={subscription?.treasuryTipRetracted}
          />
        )}
        {hasTreasuryBounty && (
          <TreasuryBountyOptions
            disabled={disabled}
            treasuryBountyProposed={subscription?.treasuryBountyProposed}
            treasuryBountyAwarded={subscription?.treasuryBountyAwarded}
            treasuryBountyApproved={subscription?.treasuryBountyApproved}
            treasuryBountyCanceled={subscription?.treasuryBountyCanceled}
            treasuryBountyClaimed={subscription?.treasuryBountyClaimed}
            treasuryBountyRejected={subscription?.treasuryBountyRejected}
          />
        )}
        {hasTreasuryChildBounty && (
          <TreasuryChildBountyOptions
            disabled={disabled}
            treasuryChildBountyAdded={subscription?.treasuryChildBountyAdded}
            treasuryChildBountyAwarded={
              subscription?.treasuryChildBountyAwarded
            }
            treasuryChildBountyCanceled={
              subscription?.treasuryChildBountyCanceled
            }
            treasuryChildBountyClaimed={
              subscription?.treasuryChildBountyClaimed
            }
          />
        )}
      </Options>
    </AccordionCard>
  );
}
