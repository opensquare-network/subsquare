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
  getDepositColumn,
  getDecisionDepositRefundColumn,
  getSubmissionDepositRefundColumn,
} from "./columns";

export function useMyDepositFellowship() {
  const { decimals, symbol } = useChainSettings();
  const submissionDeposits = useSelector(
    myFellowshipSubmissionDepositsSelector,
  );
  const decisionDeposits = useSelector(myFellowshipDecisionDepositsSelector);
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);

  const menu = getFellowshipMenu();

  const items = [
    {
      name: "Submission Deposits",
      activeCount: submissionDeposits?.length || 0,
      formatter: normalizeFellowshipReferendaListItem,
      columns: [
        getProposalPostTitleColumn(),
        getDepositColumn({ decimals, symbol }),
        getStatusTagColumn({ category: businessCategory.fellowship }),
        getSubmissionDepositRefundColumn({ pallet: "fellowshipReferenda" }),
      ],
      api: {
        async fetchData() {
          if (submissionDeposits?.length) {
            const fetchers = submissionDeposits.map((deposit) =>
              nextApi.fetch(
                getFellowshipReferendumUrl(deposit.referendumIndex),
              ),
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
      formatter: normalizeFellowshipReferendaListItem,
      columns: [
        getProposalPostTitleColumn(),
        getDepositColumn({ decimals, symbol }),
        getStatusTagColumn({ category: businessCategory.fellowship }),
        getDecisionDepositRefundColumn({ pallet: "fellowshipReferenda" }),
      ],
      api: {
        async fetchData() {
          if (decisionDeposits?.length) {
            const fetchers = decisionDeposits.map((deposit) =>
              nextApi.fetch(
                getFellowshipReferendumUrl(deposit.referendumIndex),
              ),
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
