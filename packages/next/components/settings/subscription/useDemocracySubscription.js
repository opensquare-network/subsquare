import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import useDemocracyProposalOptions from "next-common/components/setting/notification/useDemocracyProposalOptions";
import useDemocracyReferendumOptions from "next-common/components/setting/notification/useDemocracyReferendumOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function useDemocracySubscription(subscription, disabled) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasDemocracy, menu: democracyMenu } = checkSubMenu(
    homeMenus,
    "DEMOCRACY",
  );
  const { isMenuActive: hasDemocracyProposal } = checkSubMenu(
    democracyMenu?.items,
    "Proposals",
  );
  const { isMenuActive: hasDemocracyReferenda } = checkSubMenu(
    democracyMenu?.items,
    "Referenda",
  );

  const {
    democracyProposalOptionsComponent,
    getDemocracyProposalOptionValues,
    isChanged: isDemocracyProposalOptionsChanged,
  } = useDemocracyProposalOptions({
    disabled,
    democracyProposalProposed: subscription?.democracyProposalProposed,
    democracyProposalCanceled: subscription?.democracyProposalCanceled,
  });

  const {
    democracyReferendumOptionsComponent,
    getDemocracyReferendumOptionValues,
    isChanged: isDemocracyReferendumOptionsChanged,
  } = useDemocracyReferendumOptions({
    disabled,
    democracyReferendumStarted: subscription?.democracyReferendumStarted,
    democracyReferendumPassed: subscription?.democracyReferendumPassed,
    democracyReferendumNotPassed: subscription?.democracyReferendumNotPassed,
    democracyReferendumCancelled: subscription?.democracyReferendumCancelled,
    democracyReferendumExecuted: subscription?.democracyReferendumExecuted,
    democracyReferendumNotExecuted:
      subscription?.democracyReferendumNotExecuted,
  });

  let democracyOptions = null;
  if (hasDemocracy && (hasDemocracyProposal || hasDemocracyReferenda)) {
    democracyOptions = (
      <AccordionCard title="Democracy" defaultOpen={true}>
        <Options>
          {hasDemocracyProposal && democracyProposalOptionsComponent}
          {hasDemocracyReferenda && democracyReferendumOptionsComponent}
        </Options>
      </AccordionCard>
    );
  }

  return {
    democracyOptions,
    isDemocracyOptionsChanged:
      isDemocracyProposalOptionsChanged || isDemocracyReferendumOptionsChanged,
    getDemocracyOptionValues: () => {
      if (!hasDemocracy) {
        return {};
      }
      return {
        ...(hasDemocracyProposal && getDemocracyProposalOptionValues()),
        ...(hasDemocracyReferenda && getDemocracyReferendumOptionValues()),
      };
    },
  };
}
