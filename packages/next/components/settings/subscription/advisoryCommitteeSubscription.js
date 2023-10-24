import { getHomeMenu } from "next-common/utils/consts/menu";
import AdvisoryCommitteeOptions from "next-common/components/setting/notification/advisoryCommitteeOptions";
import { checkSubMenu } from "./common";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";
import { Names } from "next-common/utils/consts/menu/advisoryCouncil";

export default function AdvisoryCommitteeSubscription({
  subscription,
  disabled,
}) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasAdvisoryCommittee } = checkSubMenu(
    homeMenus,
    Names.advisoryCommittee,
  );

  if (!hasAdvisoryCommittee) {
    return null;
  }

  return (
    <AccordionCard title="Advisory Committee" defaultOpen={true}>
      <Options>
        {hasAdvisoryCommittee && (
          <AdvisoryCommitteeOptions
            disabled={disabled}
            advisoryCommitteeProposed={subscription?.advisoryCommitteeProposed}
            advisoryCommitteeVoted={subscription?.advisoryCommitteeVoted}
            advisoryCommitteeApproved={subscription?.advisoryCommitteeApproved}
            advisoryCommitteeDisApproved={
              subscription?.advisoryCommitteeDisApproved
            }
          />
        )}
      </Options>
    </AccordionCard>
  );
}
