import isNil from "lodash.isnil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import { useChainSettings } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";
import { getFellowshipReferendumUrl } from "next-common/services/url";
import {
  myFellowshipDecisionDepositsSelector,
  myFellowshipSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myFellowshipDeposits";
import { EmptyList } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import { useSelector } from "react-redux";
import {
  getDecisionDepositRefundColumn,
  getDepositColumn,
  getSubmissionDepositRefundColumn,
} from "./columns";

export async function fetchAndPopulateFellowshipDetail(deposits = []) {
  if (deposits.length <= 0) {
    return { result: EmptyList };
  }

  const fetchers = deposits.map((deposit) =>
    nextApi.fetch(getFellowshipReferendumUrl(deposit.referendumIndex)),
  );

  const resps = await Promise.all(fetchers);
  const items = resps.map((resp, idx) => {
    return {
      ...resp.result,
      ...deposits[idx],
    };
  });

  return {
    result: {
      items,
      total: deposits.length,
    },
  };
}

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
        fetchData: fetchAndPopulateFellowshipDetail.bind(
          null,
          submissionDeposits,
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
        fetchData: fetchAndPopulateFellowshipDetail.bind(
          null,
          decisionDeposits,
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
