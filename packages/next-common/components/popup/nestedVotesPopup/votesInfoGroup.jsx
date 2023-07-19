"use client";

import React from "react";
import styled from "styled-components";
import { flex, flex_col, gap_x, gap_y } from "next-common/styles/tailwindcss";
import { smcss } from "next-common/utils/responsive";
import SelfVotes from "./selfVotes";
import DelegationVotes from "./delegationVotes";

const DescriptionsGroup = styled.div`
  ${flex};
  ${gap_x(48)};

  ${smcss(gap_y(16))};
  ${smcss(flex_col)};
`;

export default function VotesInfoGroup({ data, delegations }) {
  return (
    <DescriptionsGroup>
      <SelfVotes data={data} />
      <DelegationVotes data={data} delegations={delegations} />
    </DescriptionsGroup>
  );
}
