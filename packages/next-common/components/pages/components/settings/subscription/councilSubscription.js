import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import CouncilMotionOptions from "next-common/components/setting/notification/councilMotionOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/council";

export default function CouncilSubscription() {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasCouncil, menu: councilMenu } = checkSubMenu(
    homeMenus,
    Names.council,
  );
  const { isMenuActive: hasCouncilMotion } = checkSubMenu(
    councilMenu?.items,
    Names.motions,
  );

  if (!hasCouncil || !hasCouncilMotion) {
    return null;
  }

  return (
    <AccordionCard title="Council" defaultOpen={true}>
      <Options>
        <CouncilMotionOptions />
      </Options>
    </AccordionCard>
  );
}
