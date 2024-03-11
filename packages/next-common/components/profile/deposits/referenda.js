import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import { useSelector } from "react-redux";
import {
  profileReferendaDecisionDepositsSelector,
  profileReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/profile/deposits/referenda";
import { isNil } from "lodash-es";
import { useReferendaTableItems } from "next-common/components/myDeposits/referenda";

export default function useProfileReferendaDepositsData() {
  const menu = getReferendaMenu();
  const submissionDeposits = useSelector(
    profileReferendaSubmissionDepositsSelector,
  );
  const decisionDeposits = useSelector(
    profileReferendaDecisionDepositsSelector,
  );
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);
  const items = useReferendaTableItems(submissionDeposits, decisionDeposits);

  return {
    ...menu,
    activeCount,
    loading,
    items,
  };
}
