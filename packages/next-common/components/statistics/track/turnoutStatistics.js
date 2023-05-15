import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import styled from "styled-components";
import PageTabs from "next-common/components/pageTabs";
import TurnoutPercentageChart from "./turnoutPercentageChart";
import CheckAllCheckBox from "./checkAllCheckBox";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
  gap: 16px;

  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey200Border};
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 8px;

  margin-top: 16px;
`;

const Header = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  color: ${(p) => p.theme.textPrimary};
`;

export default function TurnoutStatistics({ turnout, minWidth }) {
  const [checkAll, setCheckAll] = React.useState(true);
  const extra = (
    <CheckAllCheckBox
      checked={checkAll}
      setChecked={setCheckAll}
    />
  );

  const charts = [
    {
      name: "Turnout Pct.",
      content: <TurnoutPercentageChart turnout={turnout} minWidth={checkAll ? 0 : minWidth} />,
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
