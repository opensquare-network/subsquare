import React from "react";
import styled from "styled-components";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import {
  TYPE_DEMOCRACY_PROPOSAL,
  TYPE_DEMOCRACY_REFERENDUM,
  TYPE_COUNCIL_MOTION,
  TYPE_TECH_COMM_MOTION,
  TYPE_TREASURY_PROPOSAL,
  TYPE_TREASURY_BOUNTY,
  TYPE_TREASURY_TIP,
} from "../utils/viewConstants";

const ExternalReference = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;

  height: 41px;

  background: #f6f7fa;
  border-radius: 4px;

  span {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;

    color: #9da9bb;
  }

  a {
    display: flex;
  }
`;

function getPolkassemblyLink(type, post) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;

  switch (type) {
    case TYPE_DEMOCRACY_PROPOSAL: {
      return `https://${chain}.polkassembly.io/proposal/${post.proposalIndex}`;
    }
    case TYPE_DEMOCRACY_REFERENDUM: {
      return `https://${chain}.polkassembly.io/referendum/${post.referendumIndex}`;
    }
    case TYPE_COUNCIL_MOTION: {
      return `https://${chain}.polkassembly.io/motion/${post.motionIndex}`;
    }
    case TYPE_TECH_COMM_MOTION: {
      return `https://${chain}.polkassembly.io/tech/${post.motionIndex}`;
    }
    case TYPE_TREASURY_PROPOSAL: {
      return `https://${chain}.polkassembly.io/treasury/${post.proposalIndex}`;
    }
    case TYPE_TREASURY_BOUNTY: {
      return `https://${chain}.polkassembly.io/bounty/${post.bountyIndex}`;
    }
    case TYPE_TREASURY_TIP: {
      return `https://${chain}.polkassembly.io/tip/${post.hash}`;
    }
    default: {
      return null;
    }
  }
}

export default function PostDataSource({ type, post }) {
  const paLink = getPolkassemblyLink(type, post);
  if (!paLink) {
    return null;
  }

  return (
    <ExternalReference>
      <span>Polkassembly</span>
      <a href={paLink} target="_blank">
        <ExternalLinkIcon color="#6848FF" />
      </a>
    </ExternalReference>
  );
}
