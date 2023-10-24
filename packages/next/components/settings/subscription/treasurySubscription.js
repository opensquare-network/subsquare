import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import TreasuryChildBountyOptions from "next-common/components/setting/notification/treasuryChildBountyOptions";
import TreasuryBountyOptions from "next-common/components/setting/notification/treasuryBountyOptions";
import TreasuryTipOptions from "next-common/components/setting/notification/treasuryTipOptions";
import TreasuryProposalOptions from "next-common/components/setting/notification/treasuryProposalOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/treasury";

export default function TreasurySubscription() {
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
        {hasTreasuryProposal && <TreasuryProposalOptions />}
        {hasTreasuryTip && <TreasuryTipOptions />}
        {hasTreasuryBounty && <TreasuryBountyOptions />}
        {hasTreasuryChildBounty && <TreasuryChildBountyOptions />}
      </Options>
    </AccordionCard>
  );
}
