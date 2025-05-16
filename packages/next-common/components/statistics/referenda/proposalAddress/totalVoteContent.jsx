import React, { memo } from "react";
import { StatisticsItemDiv } from "./style";
import Divider from "next-common/components/styled/layout/divider";
import { cn, formatNum, toPrecision } from "next-common/utils";
import SymbolValue from "next-common/components/pages/components/gov2/sidebar/tally/values/symbolValue";
import VoteChart from "./voteChart";
import { useTheme } from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import {
  useAbstainVotesData,
  useAyesVotesData,
  useNaysVotesData,
} from "next-common/hooks/referenda/useVotesData";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";

const processData = (data, decimals) => {
  return data.map((value) => Number(toPrecision(value || 0, decimals)));
};
function TotalVoteItem({ className, title, numberRender, chartRender }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-x-auto overflow-y-hidden scrollbar-pretty",
        className,
      )}
    >
      <span className="text12Medium text-textTertiary mb-1">{title}</span>
      <div className="mb-4">{numberRender}</div>
      <Divider className="mb-4" />
      {chartRender}
    </div>
  );
}
function TotalVoteContent() {
  const allVotes = useSelector(allVotesSelector);
  const ayeVotesData = useAyesVotesData();
  const nayVotesData = useNaysVotesData();
  const abstainVotesData = useAbstainVotesData();
  const totalCapital = BigNumber.sum(
    abstainVotesData.totalCapitalValue,
    ayeVotesData.totalCapitalValue,
    nayVotesData.totalCapitalValue,
  ).toString();
  const totalVotes = BigNumber.sum(
    abstainVotesData.totalVotesValue,
    ayeVotesData.totalVotesValue,
    nayVotesData.totalVotesValue,
  ).toString();

  const theme = useTheme();
  const { decimals, voteSymbol, symbol } = useChainSettings();
  const categoryPercentage = 1;
  const barPercentage = 0.1;
  const dataAccounts = {
    labels: ["Delegated", "Directly"],
    datasets: [
      {
        label: "Aye",
        data: [
          ayeVotesData.delegationVotes.length,
          ayeVotesData.directVotes.length,
        ],
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: [
          nayVotesData.delegationVotes.length,
          nayVotesData.directVotes.length,
        ],
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: [
          abstainVotesData.delegationVotes.length,
          abstainVotesData.directVotes.length,
        ],
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };
  const dataCapital = {
    labels: ["Delegated", "Directly"],
    datasets: [
      {
        label: "Aye",
        data: processData(
          [
            ayeVotesData.delegationCapitalValue,
            ayeVotesData.directCapitalValue,
          ],
          decimals,
        ),
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: processData(
          [
            nayVotesData.delegationCapitalValue,
            nayVotesData.directCapitalValue,
          ],
          decimals,
        ),
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: processData(
          [
            abstainVotesData.delegationCapitalValue,
            abstainVotesData.directCapitalValue,
          ],
          decimals,
        ),
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };
  const dataVotes = {
    labels: ["Delegated", "Directly"],
    datasets: [
      {
        label: "Aye",
        data: processData(
          [ayeVotesData.delegationVotesValue, ayeVotesData.directVotesValue],
          decimals,
        ),
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: processData(
          [nayVotesData.delegationVotesValue, nayVotesData.directVotesValue],
          decimals,
        ),
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: processData(
          [
            abstainVotesData.delegationVotesValue,
            abstainVotesData.directVotesValue,
          ],
          decimals,
        ),
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };

  const dataList = [
    {
      title: "Total Accounts",
      numberRender: (
        <span className="text-textPrimary text16Bold">
          {formatNum(allVotes?.length || 0)}
        </span>
      ),
      chartRender: <VoteChart data={dataAccounts} />,
    },
    {
      title: "Total Capital",
      numberRender: <SymbolValue value={totalCapital} className="text16Bold" />,
      chartRender: (
        <VoteChart data={dataCapital} symbol={voteSymbol || symbol} />
      ),
    },
    {
      title: "Total Votes",
      numberRender: <SymbolValue value={totalVotes} className="text16Bold" />,
      chartRender: <VoteChart data={dataVotes} symbol={voteSymbol || symbol} />,
    },
  ];

  return (
    <StatisticsItemDiv className="flex max-md:flex-col md:flex-row gap-12">
      {dataList.map((i) => (
        <TotalVoteItem
          key={i.title}
          className="max-md:w-full md:flex-1"
          {...i}
        />
      ))}
    </StatisticsItemDiv>
  );
}
export default memo(TotalVoteContent);
