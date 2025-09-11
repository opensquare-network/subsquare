import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import { useSelector } from "react-redux";
import {
  profileReferendaDecisionDepositsSelector,
  profileReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/profile/deposits/referenda";
import { isNil } from "lodash-es";
import { useReferendaTableItems } from "next-common/components/myDeposits/referenda";
import { useChainSettings } from "next-common/context/chain";

export default function useProfileReferendaDepositsData() {
  const {
    modules: { referenda },
  } = useChainSettings();

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

  if (!referenda) {
    return null;
  }

  const menu = getReferendaMenu();

  return {
    ...menu,
    activeCount,
    loading,
    items,
  };
}
