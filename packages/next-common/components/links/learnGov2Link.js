import React from "react";
import styled, { useTheme } from "styled-components";
import ExternalLink from "../externalLink";
import { p_12_normal } from "../../styles/componentCss";
import ExternalLinkIcon from "../icons/externalLink";

const Link = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--textTertiary);
  ${p_12_normal};
`;

/**
 * @alias how gov2 works
 */
export default function LearnGov2Link({ anchor = "" }) {
  const { primaryPurple500 } = useTheme();

  let link = "https://wiki.polkadot.network/docs/maintain-guides-opengov";
  if (anchor) {
    link += `#${anchor}`;
  }

  return (
    <Link href={link}>
      How Governance V2 Works
      <ExternalLinkIcon color={primaryPurple500} />
    </Link>
  );
}
