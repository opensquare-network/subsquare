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

export function useMyDepositReferenda() {
  const { decimals, symbol } = useChainSettings();
  const submissionDeposits = useSelector(myReferendaSubmissionDepositsSelector);
  const decisionDeposits = useSelector(myReferendaDecisionDepositsSelector);
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);

  const menu = getReferendaMenu();

  const items = [
    {
      name: "Submission Deposits",
      activeCount: submissionDeposits?.length || 0,
      formatter: normalizeGov2ReferendaListItem,
      columns: [
        getProposalPostTitleColumn(),
        getDepositColumn({ decimals, symbol }),
        getStatusTagColumn({ category: businessCategory.openGovReferenda }),
        getSubmissionDepositRefundColumn({ pallet: "referenda" }),
      ],
      api: {
        async fetchData() {
          if (submissionDeposits?.length) {
            const fetchers = submissionDeposits.map((deposit) =>
              nextApi.fetch(gov2ReferendumsDetailApi(deposit.referendumIndex)),
            );

            const resps = await Promise.all(fetchers);

            const items = resps.map((resp, idx) => {
              return {
                ...resp.result,
                ...submissionDeposits[idx],
              };
            });

            return {
              result: {
                items,
                total: activeCount,
              },
            };
          }

          return { result: EmptyList };
        },
      },
    },
    {
      name: "Decision Deposits",
      activeCount: decisionDeposits?.length || 0,
      formatter: normalizeGov2ReferendaListItem,
      columns: [
        getProposalPostTitleColumn(),
        getDepositColumn({ decimals, symbol }),
        getStatusTagColumn({ category: businessCategory.openGovReferenda }),
        getDecisionDepositRefundColumn({ pallet: "referenda" }),
      ],
      api: {
        async fetchData() {
          if (decisionDeposits?.length) {
            const fetchers = decisionDeposits.map((deposit) =>
              nextApi.fetch(gov2ReferendumsDetailApi(deposit.referendumIndex)),
            );

            const resps = await Promise.all(fetchers);

            const items = resps.map((resp, idx) => {
              return {
                ...resp.result,
                ...decisionDeposits[idx],
              };
            });

            return {
              result: {
                items,
                total: activeCount,
              },
            };
          }

          return { result: EmptyList };
        },
      },
    },
  ];

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
