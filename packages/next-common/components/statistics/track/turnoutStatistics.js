import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import PageTabs from "next-common/components/pageTabs";
import TurnoutPercentageChart from "./turnoutPercentageChart";
import CheckAllCheckBox from "./checkAllCheckBox";
import { Header, Wrapper } from "../styled";

export default function TurnoutStatistics({ turnout }) {
  const [checkAll, setCheckAll] = React.useState(true);
  const extra = (
    <CheckAllCheckBox checked={checkAll} setChecked={setCheckAll} />
  );
  const minWidth = (turnout.length || 0) * 10;

  const charts = [
    {
      name: "Turnout Pct.",
      content: (
        <TurnoutPercentageChart
          turnout={turnout}
          minWidth={checkAll ? 0 : minWidth}
        />
      ),
      extra,
    },
  ];

  return (
    <Wrapper>
      <Header>Turnout</Header>
      <Divider />
      <PageTabs tabs={charts} />
    </Wrapper>
  );
}
