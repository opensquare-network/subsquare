import React from "react";
import styled from "styled-components";
import { Header, Wrapper } from "../../styled";
import Divider from "next-common/components/styled/layout/divider";
import { DoughnutChart } from "./doughnetChart";
import TrackList from "./trackList";

const Content = styled.div`
  display: flex;
  gap: 24px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export default function ReferendaSummary({ summary }) {
  return (
    <Wrapper>
      <Header>All Referenda</Header>
      <Divider />
      <Header>Referendum Count</Header>
      <Content>
        <TrackList trackReferendaCounts={summary?.trackReferendaCounts} />
        <DoughnutChart trackReferendaCounts={summary?.trackReferendaCounts} />
      </Content>
    </Wrapper>
  );
}
