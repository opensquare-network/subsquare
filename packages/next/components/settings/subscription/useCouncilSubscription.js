import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import FoldableSections from "next-common/components/setting/notification/foldableSections";
import useCouncilMotionOptions from "next-common/components/setting/notification/useCouncilMotionOptions";

export default function useCouncilSubscription(subscription, saving, disabled) {
  const homeMenus = getHomeMenu();

  const { hasMenu: hasCouncil, menu: councilMenu } = checkSubMenu(
    homeMenus,
    "COUNCIL",
  );
  const { hasMenu: hasCouncilMotion } = checkSubMenu(
    councilMenu?.items,
    "Motions",
  );

  const {
    councilMotionOptionsComponent,
    getCouncilMotionOptionValues,
    isChanged: isCouncilMotionOptionsChanged,
  } = useCouncilMotionOptions({
    disabled,
    saving,
    councilMotionProposed: subscription?.councilMotionProposed,
    councilMotionVoted: subscription?.councilMotionVoted,
    councilMotionApproved: subscription?.councilMotionApproved,
    councilMotionDisApproved: subscription?.councilMotionDisApproved,
  });

  let councilOptions = null;
  if (hasCouncil && hasCouncilMotion) {
    councilOptions = (
      <FoldableSections title="Council">
        {hasCouncilMotion && councilMotionOptionsComponent}
      </FoldableSections>
    );
  }

  return {
    councilOptions,
    isCouncilOptionsChanged: isCouncilMotionOptionsChanged,
    getCouncilOptionValues: () => {
      if (!hasCouncil || !hasCouncilMotion) {
        return {};
      }
      return getCouncilMotionOptionValues();
    },
  };
}
