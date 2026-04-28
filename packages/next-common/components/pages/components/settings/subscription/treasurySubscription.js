import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import TreasuryChildBountyOptions from "next-common/components/setting/notification/treasuryChildBountyOptions";
import TreasuryBountyOptions from "next-common/components/setting/notification/treasuryBountyOptions";
import TreasuryTipOptions from "next-common/components/setting/notification/treasuryTipOptions";
import TreasuryProposalOptions from "next-common/components/setting/notification/treasuryProposalOptions";
import MultiAssetBountyOptions from "next-common/components/setting/notification/multiAssetBountyOptions";
import MultiAssetChildBountyOptions from "next-common/components/setting/notification/multiAssetChildBountyOptions";
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
  const { isMenuActive: hasMultiAssetBounty } = checkSubMenu(
    treasuryMenu?.items,
    Names.multiAssetBounties,
  );
  const { isMenuActive: hasMultiAssetChildBounty } = checkSubMenu(
    treasuryMenu?.items,
    Names.multiAssetChildBounties,
  );

  if (
    !hasTreasury ||
    (!hasTreasuryProposal &&
      !hasTreasuryTip &&
      !hasTreasuryBounty &&
      !hasTreasuryChildBounty &&
      !hasMultiAssetBounty &&
      !hasMultiAssetChildBounty)
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
        {hasMultiAssetBounty && <MultiAssetBountyOptions />}
        {hasMultiAssetChildBounty && <MultiAssetChildBountyOptions />}
      </Options>
    </AccordionCard>
  );
}
