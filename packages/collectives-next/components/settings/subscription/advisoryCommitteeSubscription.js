import { getHomeMenu } from "next-common/utils/consts/menu";
import AdvisoryCommitteeOptions from "next-common/components/setting/notification/advisoryCommitteeOptions";
import { checkSubMenu } from "./common";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/advisoryCouncil";

export default function AdvisoryCommitteeSubscription() {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasAdvisoryCommittee } = checkSubMenu(
    homeMenus,
    Names.advisoryCommittee,
  );

  if (!hasAdvisoryCommittee) {
    return null;
  }
  console.log("====", hasAdvisoryCommittee);

  return (
    <AccordionCard title="Advisory Committee" defaultOpen={true}>
      <Options>
        <AdvisoryCommitteeOptions />
      </Options>
    </AccordionCard>
  );
}
