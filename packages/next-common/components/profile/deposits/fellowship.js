import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";
import { useSelector } from "react-redux";
import {
  profileFellowshipDecisionDepositsSelector,
  profileFellowshipSubmissionDepositsSelector,
} from "next-common/store/reducers/profile/deposits/fellowship";
import { isNil } from "lodash-es";
import { useFellowshipTableItems } from "next-common/components/myDeposits/fellowship";
import { useChainSettings } from "next-common/context/chain";

export default function useProfileFellowshipDepositsData() {
  const {
    modules: { fellowship },
  } = useChainSettings();

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

  if (!fellowship) {
    return null;
  }

  const menu = getFellowshipMenu();

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
