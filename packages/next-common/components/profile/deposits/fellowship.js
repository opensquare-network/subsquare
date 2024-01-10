import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";
import { useSelector } from "react-redux";
import {
  profileFellowshipDecisionDepositsSelector,
  profileFellowshipSubmissionDepositsSelector,
} from "next-common/store/reducers/profile/deposits/fellowship";
import isNil from "lodash.isnil";
import { useFellowshipTableItems } from "next-common/components/myDeposits/fellowship";

export default function useProfileFellowshipDepositsData() {
  const menu = getFellowshipMenu();
  const submissionDeposits = useSelector(
    profileFellowshipSubmissionDepositsSelector,
  );
  const decisionDeposits = useSelector(
    profileFellowshipDecisionDepositsSelector,
  );
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);
  const items = useFellowshipTableItems(submissionDeposits, decisionDeposits);

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
