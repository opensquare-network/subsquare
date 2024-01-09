import isNil from "lodash.isnil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import { useChainSettings } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsDetailApi } from "next-common/services/url";
import {
  myReferendaDecisionDepositsSelector,
  myReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myReferendaDeposits";
import { EmptyList } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import { useSelector } from "react-redux";
import {
  getDepositColumn,
  getDecisionDepositRefundColumn,
  getSubmissionDepositRefundColumn,
} from "./columns";

export async function fetchAndPopulateReferendaDetail(deposits = []) {
  if (deposits.length <= 0) {
    return { result: EmptyList };
  }

  const fetchers = deposits.map((deposit) =>
    nextApi.fetch(gov2ReferendumsDetailApi(deposit.referendumIndex)),
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
        fetchData: fetchAndPopulateReferendaDetail.bind(
          null,
          submissionDeposits,
        ),
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
        fetchData: fetchAndPopulateReferendaDetail.bind(null, decisionDeposits),
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
