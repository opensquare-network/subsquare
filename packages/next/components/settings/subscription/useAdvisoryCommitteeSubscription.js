import { getHomeMenu } from "next-common/utils/consts/menu";
import useAdvisoryCommitteeOptions from "next-common/components/setting/notification/useAdvisoryCommitteeOptions";
import { checkSubMenu } from "./common";
import FoldableSections from "next-common/components/setting/notification/foldableSections";

export default function useAdvisoryCommitteeSubscription(
  subscription,
  saving,
  disabled,
) {
  const homeMenus = getHomeMenu();

  const { hasMenu: hasAdvisoryCommittee } = checkSubMenu(
    homeMenus,
    "ADVISORY COMMITTEE",
  );

  const {
    advisoryCommitteeOptionsComponent,
    getAdvisoryCommitteeOptionValues,
    isChanged: isAdvisoryCommitteeOptionsChanged,
  } = useAdvisoryCommitteeOptions({
    disabled,
    saving,
    advisoryCommitteeProposed: subscription?.advisoryCommitteeProposed,
    advisoryCommitteeVoted: subscription?.advisoryCommitteeVoted,
    advisoryCommitteeApproved: subscription?.advisoryCommitteeApproved,
    advisoryCommitteeDisApproved: subscription?.advisoryCommitteeDisApproved,
  });

  let advisoryOptions = null;
  if (hasAdvisoryCommittee) {
    advisoryOptions = (
      <FoldableSections title="Advisory Committee">
        {hasAdvisoryCommittee && advisoryCommitteeOptionsComponent}
      </FoldableSections>
    );
  }

  return {
    advisoryOptions,
    isAdvisoryCommitteeOptionsChanged,
    getAdvisoryCommitteeOptionValues: () => {
      if (!hasAdvisoryCommittee) {
        return {};
      }
      return getAdvisoryCommitteeOptionValues();
    },
  };
}
