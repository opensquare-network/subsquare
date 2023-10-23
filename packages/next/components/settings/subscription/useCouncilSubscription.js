import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import useCouncilMotionOptions from "next-common/components/setting/notification/useCouncilMotionOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function useCouncilSubscription(subscription, disabled) {
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
