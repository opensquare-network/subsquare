import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";

export function useSubmissionDeposit() {
  const listPageType = useListPageType();

  let pallet = "referenda";
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
  }

  return {
    component: <SubmissionDeposit pallet={pallet} />,
  };
}
