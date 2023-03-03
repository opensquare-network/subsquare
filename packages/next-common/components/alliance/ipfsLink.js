import React from "react";
import ExternalLink from "../externalLink";
import getIpfsLink from "../../utils/env/ipfsEndpoint";
import styled from "styled-components";
import ExternalLinkIcon from "../icons/externalLink";

const Link = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary};

  span:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: 6px;
  }
`;

export default function IpfsLink({ cid }) {
  return (
    <Link title={cid} href={getIpfsLink(cid)}>
      <span>IPFS</span>
      <ExternalLinkIcon />
    </Link>
  );
}
