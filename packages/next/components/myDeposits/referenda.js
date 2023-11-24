import isNil from "lodash.isnil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import useFetchMyReferendaDeposits from "next-common/hooks/account/deposit/referenda";
import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsDetailApi } from "next-common/services/url";
import {
  myReferendaDecisionDepositsSelector,
  myReferendaSubmissionDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myReferendaDeposits";
import { toPrecision } from "next-common/utils";
import { EmptyList } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import { useSelector } from "react-redux";

export function useMyDepositReferenda() {
  useFetchMyReferendaDeposits();

  const { decimals, symbol } = useChainSettings();
  const submissionDeposits = useSelector(myReferendaSubmissionDepositsSelector);
  const decisionDeposits = useSelector(myReferendaDecisionDepositsSelector);
  const activeCount =
    (submissionDeposits?.length || 0) + (decisionDeposits?.length || 0);
  const loading = isNil(submissionDeposits) || isNil(decisionDeposits);

  const menu = getReferendaMenu();

  const options = {
    columns: [
      getProposalPostTitleColumn(),
      {
        name: "Deposit",
        className: "w-40 text-right",
        cellRender(data) {
          return (
            <ValueDisplay
              value={toPrecision(data.deposit, decimals)}
              symbol={symbol}
            />
          );
        },
      },
      getStatusTagColumn({ category: businessCategory.openGovReferenda }),
    ],
    formatter: normalizeGov2ReferendaListItem,
  };

  const items = [
    {
      ...options,
      name: "Submission Deposits",
      activeCount: submissionDeposits?.length || 0,
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
      ...options,
      name: "Decision Deposits",
      activeCount: decisionDeposits?.length || 0,
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
