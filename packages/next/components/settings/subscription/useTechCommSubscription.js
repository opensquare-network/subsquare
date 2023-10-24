import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import useTechCommMotionOptions from "next-common/components/setting/notification/useTechCommMotionOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/tc";

export default function useTechCommSubscription(subscription, disabled) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasTechComm, menu: techCommMenu } = checkSubMenu(
    homeMenus,
    Names.techComm,
  );
  const { isMenuActive: hasTechCommMotion } = checkSubMenu(
    techCommMenu?.items,
    Names.techCommProposals,
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
