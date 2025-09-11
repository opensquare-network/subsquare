import React, { memo } from "react";
import "next-common/components/charts/globalConfig";
import TotalVoteContent from "./totalVoteContent";
import AccountsConvictionUsedContent from "./accountsConvictionUsedContent";
import AccountsVotesContent from "./accountsVotesContent";
import { StatisticsDiv } from "./style";
import Divider from "next-common/components/styled/layout/divider";

function StatisticsContent() {
  return (
    <StatisticsDiv className="flex flex-col">
      <TotalVoteContent />
      <Divider />
      <AccountsConvictionUsedContent />
      <Divider />
      <AccountsVotesContent />
    </StatisticsDiv>
  );
}
export default memo(StatisticsContent);
