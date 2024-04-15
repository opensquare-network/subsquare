import React, { memo } from "react";
import TotalVoteContent from "./totalVoteContent";
import AccountsConvictionUsedContent from "./accountsConvictionUsedContent";
import { StatisticsDiv } from "./style";
import Divider from "next-common/components/styled/layout/divider";
function StatisticsContent() {
  return (
    <StatisticsDiv className="flex flex-col">
      <TotalVoteContent />
      <Divider />
      <AccountsConvictionUsedContent />
    </StatisticsDiv>
  );
}
export default memo(StatisticsContent);
