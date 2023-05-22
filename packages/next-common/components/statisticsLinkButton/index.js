import React from "react";
import styled from "styled-components";
import StatisticsSVG from "./statistics.svg";
import Link from "next/link";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.primaryPurple500};
  gap: 8px;
`;

export default function StatisticLinkButton({ href }) {
  return (
    <Link href={href} passHref>
      <Wrapper>
        <StatisticsSVG />
        <span>Statistics</span>
      </Wrapper>
    </Link>
  );
}
