import React from "react";
import styled, { useTheme } from "styled-components";
import ExternalLink from "../externalLink";
import { p_12_normal } from "../../styles/componentCss";
import ExternalLinkIcon from "../icons/externalLink";

const Link = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};
`;

/**
 * @alias how gov2 works
 */
export default function LearnGov2Link() {
  const { primaryPurple500 } = useTheme();

  return (
    <Link href="https://wiki.polkadot.network/docs/learn-gov2/">
      How Governance V2 Works
      <ExternalLinkIcon color={primaryPurple500} />
    </Link>
  );
}
