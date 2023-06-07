import React from "react";
import styled from "styled-components";
import StatisticsSVG from "./statistics.svg";
import Link from "next/link";
import { p_14_bold } from "next-common/styles/componentCss";
import { smcss } from "next-common/utils/responsive";
import { hidden, inline } from "next-common/styles/tailwindcss";
import { isExternalLink } from "next-common/utils";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.primaryPurple500};
  gap: 8px;
  ${p_14_bold};
`;

const AbbreviateLabel = styled.span`
  ${hidden};
  ${smcss(inline)};
`;

const Label = styled.span`
  ${inline};
  ${smcss(hidden)};
`;

export default function StatisticLinkButton({ href }) {
  const external = isExternalLink(href);

  return (
    <Link href={href} passHref target={external ? "_blank" : "_self"}>
      <Wrapper>
        <StatisticsSVG />
        <Label>Statistics</Label>
        <AbbreviateLabel>Stats</AbbreviateLabel>
      </Wrapper>
    </Link>
  );
}
