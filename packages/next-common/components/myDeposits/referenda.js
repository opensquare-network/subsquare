import { isNil } from "lodash-es";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/recentProposals/columns";
import { useChainSettings } from "next-common/context/chain";
import {
  myReferendaDecisionDepositsSelector,
  myReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myReferendaDeposits";
import businessCategory from "next-common/utils/consts/business/category";
import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import { useSelector } from "react-redux";
import {
  getDecisionDepositRefundColumn,
  getDepositColumn,
  getSubmissionDepositRefundColumn,
} from "./columns";
import { fetchAndPopulateDetail } from "next-common/components/myDeposits/referenda/fetchAndPopulateDetail";

export function getReferendaDepositCommonColumns(decimals, symbol) {
  return [
    getProposalPostTitleColumn(),
    getDepositColumn({ decimals, symbol }),
    getStatusTagColumn({ category: businessCategory.openGovReferenda }),
  ];
}

export function useReferendaTableItems(
  submissionDeposits = [],
  decisionDeposits = [],
) {
  const { decimals, symbol } = useChainSettings();
  return [
    {
      name: "Submission Deposits",
      activeCount: submissionDeposits?.length || 0,
      formatter: normalizeGov2ReferendaListItem,
      columns: [
        ...getReferendaDepositCommonColumns(decimals, symbol),
        getSubmissionDepositRefundColumn({ pallet: "referenda" }),
      ],
      api: {
        fetchData: fetchAndPopulateDetail.bind(null, submissionDeposits),
      },
    },
    {
      name: "Decision Deposits",
      activeCount: decisionDeposits?.length || 0,
      formatter: normalizeGov2ReferendaListItem,
      columns: [
        ...getReferendaDepositCommonColumns(decimals, symbol),
        getDecisionDepositRefundColumn({ pallet: "referenda" }),
      ],
      api: {
        fetchData: fetchAndPopulateDetail.bind(null, decisionDeposits),
      },
    },
  ];
}

export function useMyDepositReferenda() {
  const submissionDeposits = useSelector(myReferendaSubmissionDepositsSelector);
  const decisionDeposits = useSelector(myReferendaDecisionDepositsSelector);
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);

  const menu = getReferendaMenu();
  const items = useReferendaTableItems(submissionDeposits, decisionDeposits);

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
