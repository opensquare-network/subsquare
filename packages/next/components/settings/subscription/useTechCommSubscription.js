import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import FoldableSections from "next-common/components/setting/notification/foldableSections";
import useTechCommMotionOptions from "next-common/components/setting/notification/useTechCommMotionOptions";

export default function useTechCommSubscription(
  subscription,
  saving,
  disabled,
) {
  const homeMenus = getHomeMenu();

  const { hasMenu: hasTechComm, menu: techCommMenu } = checkSubMenu(
    homeMenus,
    "TECH.COMM.",
  );
  const { hasMenu: hasTechCommMotion } = checkSubMenu(
    techCommMenu?.items,
    "Proposals",
  );

  const {
    techCommMotionOptionsComponent,
    getTechCommMotionOptionValues,
    isChanged: isTechCommMotionOptionsChanged,
  } = useTechCommMotionOptions({
    disabled,
    saving,
    tcMotionProposed: subscription?.tcMotionProposed,
    tcMotionVoted: subscription?.tcMotionVoted,
    tcMotionApproved: subscription?.tcMotionApproved,
    tcMotionDisApproved: subscription?.tcMotionDisApproved,
  });

  let techCommOptions = null;
  if (hasTechComm && hasTechCommMotion) {
    techCommOptions = (
      <FoldableSections title="Tech-Comm.">
        {hasTechCommMotion && techCommMotionOptionsComponent}
      </FoldableSections>
    );
  }

  return {
    techCommOptions,
    isTechCommOptionsChanged: isTechCommMotionOptionsChanged,
    getTechCommOptionValues: () => {
      if (!hasTechComm || !hasTechCommMotion) {
        return {};
      }
      return getTechCommMotionOptionValues();
    },
  };
}
