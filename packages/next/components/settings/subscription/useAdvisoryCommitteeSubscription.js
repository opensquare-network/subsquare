import { getHomeMenu } from "next-common/utils/consts/menu";
import useAdvisoryCommitteeOptions from "next-common/components/setting/notification/useAdvisoryCommitteeOptions";
import { checkSubMenu } from "./common";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function useAdvisoryCommitteeSubscription(
  subscription,
  disabled,
) {
  const homeMenus = getHomeMenu();

  const { isMenuActive: hasAdvisoryCommittee } = checkSubMenu(
    homeMenus,
    "ADVISORY COMMITTEE",
  );

  const {
    advisoryCommitteeOptionsComponent,
    getAdvisoryCommitteeOptionValues,
    isChanged: isAdvisoryCommitteeOptionsChanged,
  } = useAdvisoryCommitteeOptions({
    disabled,
    advisoryCommitteeProposed: subscription?.advisoryCommitteeProposed,
    advisoryCommitteeVoted: subscription?.advisoryCommitteeVoted,
    advisoryCommitteeApproved: subscription?.advisoryCommitteeApproved,
    advisoryCommitteeDisApproved: subscription?.advisoryCommitteeDisApproved,
  });

  let advisoryOptions = null;
  if (hasAdvisoryCommittee) {
    advisoryOptions = (
      <AccordionCard title="Advisory Committee" defaultOpen={true}>
        <Options>
          {hasAdvisoryCommittee && advisoryCommitteeOptionsComponent}
        </Options>
      </AccordionCard>
    );
  }

  return {
    advisoryOptions,
    isAdvisoryCommitteeOptionsChanged,
    getAdvisoryCommitteeOptionValues: () => {
      if (!hasAdvisoryCommittee) {
        return {};
      }
      return getAdvisoryCommitteeOptionValues();
    },
  };
}
