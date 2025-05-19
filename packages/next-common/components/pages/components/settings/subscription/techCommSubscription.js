import { getHomeMenu } from "next-common/utils/consts/menu";
import { checkSubMenu } from "./common";
import TechCommMotionOptions from "next-common/components/setting/notification/techCommMotionOptions";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/tc";

export default function TechCommSubscription() {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasTechComm, menu: techCommMenu } = checkSubMenu(
    homeMenus,
    Names.techComm,
  );
  const { isMenuActive: hasTechCommMotion } = checkSubMenu(
    techCommMenu?.items,
    Names.techCommProposals,
  );

  if (!hasTechComm || !hasTechCommMotion) {
    return null;
  }

  return (
    <AccordionCard title="Tech-Comm." defaultOpen={true}>
      <Options>
        <TechCommMotionOptions />
      </Options>
    </AccordionCard>
  );
}
