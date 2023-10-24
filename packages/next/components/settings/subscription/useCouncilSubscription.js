import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import useCouncilMotionOptions from "next-common/components/setting/notification/useCouncilMotionOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/council";

export default function useCouncilSubscription(subscription, disabled) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasCouncil, menu: councilMenu } = checkSubMenu(
    homeMenus,
    Names.council,
  );
  const { isMenuActive: hasCouncilMotion } = checkSubMenu(
    councilMenu?.items,
    Names.motions,
  );

  const {
    councilMotionOptionsComponent,
    getCouncilMotionOptionValues,
    isChanged: isCouncilMotionOptionsChanged,
  } = useCouncilMotionOptions({
    disabled,
    councilMotionProposed: subscription?.councilMotionProposed,
    councilMotionVoted: subscription?.councilMotionVoted,
    councilMotionApproved: subscription?.councilMotionApproved,
    councilMotionDisApproved: subscription?.councilMotionDisApproved,
  });

  let councilOptions = null;
  if (hasCouncil && hasCouncilMotion) {
    councilOptions = (
      <AccordionCard title="Council" defaultOpen={true}>
        <Options>{hasCouncilMotion && councilMotionOptionsComponent}</Options>
      </AccordionCard>
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
