import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import DemocracyProposalOptions from "next-common/components/setting/notification/democracyProposalOptions";
import DemocracyReferendumOptions from "next-common/components/setting/notification/democracyReferendumOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/democracy";

export default function DemocracySubscription({ subscription, disabled }) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasDemocracy, menu: democracyMenu } = checkSubMenu(
    homeMenus,
    Names.democracy,
  );
  const { isMenuActive: hasDemocracyProposal } = checkSubMenu(
    democracyMenu?.items,
    Names.democracyProposals,
  );
  const { isMenuActive: hasDemocracyReferenda } = checkSubMenu(
    democracyMenu?.items,
    Names.referenda,
  );

  if (!hasDemocracy || (!hasDemocracyProposal && !hasDemocracyReferenda)) {
    return null;
  }

  return (
    <AccordionCard title="Democracy" defaultOpen={true}>
      <Options>
        {hasDemocracyProposal && (
          <DemocracyProposalOptions
            disabled={disabled}
            democracyProposalProposed={subscription?.democracyProposalProposed}
            democracyProposalCanceled={subscription?.democracyProposalCanceled}
          />
        )}
        {hasDemocracyReferenda && (
          <DemocracyReferendumOptions
            disabled={disabled}
            democracyReferendumStarted={
              subscription?.democracyReferendumStarted
            }
            democracyReferendumPassed={subscription?.democracyReferendumPassed}
            democracyReferendumNotPassed={
              subscription?.democracyReferendumNotPassed
            }
            democracyReferendumCancelled={
              subscription?.democracyReferendumCancelled
            }
            democracyReferendumExecuted={
              subscription?.democracyReferendumExecuted
            }
            democracyReferendumNotExecuted={
              subscription?.democracyReferendumNotExecuted
            }
          />
        )}
      </Options>
    </AccordionCard>
  );
}
