import { isNil } from "lodash-es";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/recentProposals/columns";
import { useChainSettings } from "next-common/context/chain";
import {
  myFellowshipDecisionDepositsSelector,
  myFellowshipSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myFellowshipDeposits";
import businessCategory from "next-common/utils/consts/business/category";
import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import { useSelector } from "react-redux";
import {
  getDecisionDepositRefundColumn,
  getDepositColumn,
  getSubmissionDepositRefundColumn,
} from "./columns";
import { fetchAndPopulateDetail } from "next-common/components/myDeposits/referenda/fetchAndPopulateDetail";

export function getFellowshipDepositCommonColumns(decimals, symbol) {
  return [
    getProposalPostTitleColumn(),
    getDepositColumn({ decimals, symbol }),
    getStatusTagColumn({ category: businessCategory.fellowship }),
  ];
}

export function useFellowshipTableItems(
  submissionDeposits = [],
  decisionDeposits = [],
) {
  const { decimals, symbol } = useChainSettings();

  return [
    {
      name: "Submission Deposits",
      activeCount: submissionDeposits?.length || 0,
      formatter: normalizeFellowshipReferendaListItem,
      columns: [
        ...getFellowshipDepositCommonColumns(decimals, symbol),
        getSubmissionDepositRefundColumn({ pallet: "fellowshipReferenda" }),
      ],
      api: {
        fetchData: fetchAndPopulateDetail.bind(
          null,
          submissionDeposits,
          "fellowshipReferenda",
        ),
      },
    },
    {
      name: "Decision Deposits",
      activeCount: decisionDeposits?.length || 0,
      formatter: normalizeFellowshipReferendaListItem,
      columns: [
        ...getFellowshipDepositCommonColumns(decimals, symbol),
        getDecisionDepositRefundColumn({ pallet: "fellowshipReferenda" }),
      ],
      api: {
        fetchData: fetchAndPopulateDetail.bind(
          null,
          decisionDeposits,
          "fellowshipReferenda",
        ),
      },
    },
  ];
}

export function useMyDepositFellowship() {
  const submissionDeposits = useSelector(
    myFellowshipSubmissionDepositsSelector,
  );
  const decisionDeposits = useSelector(myFellowshipDecisionDepositsSelector);
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);

  const menu = getFellowshipMenu();
  const items = useFellowshipTableItems(submissionDeposits, decisionDeposits);

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
