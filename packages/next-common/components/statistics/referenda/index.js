import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import PageTabs from "next-common/components/pageTabs";
import TrackDelegationChart from "./trackDelegationChart";
import AddressCountChart from "./addressCountChart";
import ReferendaDelegatee from "./referendaDelegatee";
import { Header, Wrapper } from "../styled";

export default function ReferendaStatistics({ tracks, delegatee }) {
  const charts = [
    {
      name: "Track Delegation",
      content: <TrackDelegationChart tracks={tracks} />,
    },
    {
      name: "Addr Count",
      content: <AddressCountChart tracks={tracks} />,
    },
  ];

  const lists = [
    {
      name: "Delegatee",
      content: <ReferendaDelegatee delegatee={delegatee} />,
    },
  ];

  return (
    <Wrapper>
      <Header>Delegation</Header>
      <Divider />
      <PageTabs tabs={charts} />
      <Divider />
      <PageTabs tabs={lists} />
    </Wrapper>
  );
}
