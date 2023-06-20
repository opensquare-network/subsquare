import React from "react";
import styled from "styled-components";
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
  let link = "https://wiki.polkadot.network/docs/maintain-guides-opengov";
  if (anchor) {
    link += `#${anchor}`;
  }

  return (
    <Link href={link}>
      How Governance V2 Works
      <ExternalLinkIcon color="var(--purple500)" />
    </Link>
  );
}
