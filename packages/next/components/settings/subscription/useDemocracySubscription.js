import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import FoldableSections from "next-common/components/setting/notification/foldableSections";
import useDemocracyProposalOptions from "next-common/components/setting/notification/useDemocracyProposalOptions";
import useDemocracyReferendumOptions from "next-common/components/setting/notification/useDemocracyReferendumOptions";

export default function useDemocracySubscription(
  subscription,
  saving,
  disabled,
) {
  const homeMenus = getHomeMenu();

  const { hasMenu: hasDemocracy, menu: democracyMenu } = checkSubMenu(
    homeMenus,
    "DEMOCRACY",
  );
  const { hasMenu: hasDemocracyProposal } = checkSubMenu(
    democracyMenu?.items,
    "Proposals",
  );
  const { hasMenu: hasDemocracyReferenda } = checkSubMenu(
    democracyMenu?.items,
    "Referenda",
  );

  const {
    democracyProposalOptionsComponent,
    getDemocracyProposalOptionValues,
    isChanged: isDemocracyProposalOptionsChanged,
  } = useDemocracyProposalOptions({
    disabled,
    saving,
    democracyProposalProposed: subscription?.democracyProposalProposed,
    democracyProposalCanceled: subscription?.democracyProposalCanceled,
  });

  const {
    democracyReferendumOptionsComponent,
    getDemocracyReferendumOptionValues,
    isChanged: isDemocracyReferendumOptionsChanged,
  } = useDemocracyReferendumOptions({
    disabled,
    saving,
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
      <FoldableSections title="Democracy">
        {hasDemocracyProposal && democracyProposalOptionsComponent}
        {hasDemocracyReferenda && democracyReferendumOptionsComponent}
      </FoldableSections>
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
