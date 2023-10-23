import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import useTechCommMotionOptions from "next-common/components/setting/notification/useTechCommMotionOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function useTechCommSubscription(subscription, disabled) {
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
    tcMotionProposed: subscription?.tcMotionProposed,
    tcMotionVoted: subscription?.tcMotionVoted,
    tcMotionApproved: subscription?.tcMotionApproved,
    tcMotionDisApproved: subscription?.tcMotionDisApproved,
  });

  let techCommOptions = null;
  if (hasTechComm && hasTechCommMotion) {
    techCommOptions = (
      <AccordionCard title="Tech-Comm." defaultOpen={true}>
        <Options>{hasTechCommMotion && techCommMotionOptionsComponent}</Options>
      </AccordionCard>
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
