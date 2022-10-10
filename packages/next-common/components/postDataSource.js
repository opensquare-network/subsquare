import React from "react";
import styled from "styled-components";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import { detailPageCategory } from "../utils/consts/business/category";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import Chains from "../utils/consts/chains";
import { usePost, usePostType } from "../context/post";

const ExternalReference = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-top: 16px;
  gap: 8px;

  height: 41px;

  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;

  span {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;

    color: ${(props) => props.theme.textTertiary};
  }

  a {
    display: flex;
  }
`;

function getPolkassemblyLink(type, post) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;

  switch (type) {
    case detailPageCategory.DEMOCRACY_PROPOSAL: {
      return `https://${chain}.polkassembly.io/proposal/${post.proposalIndex}`;
    }
    case detailPageCategory.DEMOCRACY_REFERENDUM: {
      return `https://${chain}.polkassembly.io/referendum/${post.referendumIndex}`;
    }
    case detailPageCategory.COUNCIL_MOTION: {
      return `https://${chain}.polkassembly.io/motion/${post.motionIndex}`;
    }
    case detailPageCategory.TECH_COMM_MOTION: {
      return `https://${chain}.polkassembly.io/tech/${post.motionIndex}`;
    }
    case detailPageCategory.TREASURY_PROPOSAL: {
      return `https://${chain}.polkassembly.io/treasury/${post.proposalIndex}`;
    }
    case detailPageCategory.TREASURY_BOUNTY: {
      return `https://${chain}.polkassembly.io/bounty/${post.bountyIndex}`;
    }
    case detailPageCategory.TREASURY_TIP: {
      return `https://${chain}.polkassembly.io/tip/${post.hash}`;
    }
    case detailPageCategory.PA_POST: {
      return `https://${chain}.polkassembly.io/post/${post.polkassemblyId}`;
    }
    case detailPageCategory.TREASURY_CHILD_BOUNTY: {
      return `https://${chain}.polkassembly.io/child_bounty/${post.index}`;
    }
    default: {
      return null;
    }
  }
}

export default function PostDataSource() {
  const post = usePost();
  const type = usePostType();
  const chain = useSelector(chainSelector)

  if (![Chains.kusama, Chains.polkadot].includes(chain)) {
    return null;
  }

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
