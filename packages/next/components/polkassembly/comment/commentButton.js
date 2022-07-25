import React from "react";
import styled from "styled-components";
import Button from "next-common/components/button";
import {
  TYPE_COUNCIL_MOTION,
  TYPE_DEMOCRACY_PROPOSAL,
  TYPE_DEMOCRACY_REFERENDUM,
  TYPE_TECH_COMM_MOTION,
  TYPE_TREASURY_BOUNTY,
  TYPE_TREASURY_CHILD_BOUNTY,
  TYPE_TREASURY_PROPOSAL,
  TYPE_TREASURY_TIP,
} from "next-common/utils/viewConstants";

const Wrapper = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function PolkassemblyCommentButton({
  detail,
  chain,
  paId,
  type,
  btnRef,
}) {
  let link = `https://${chain}.polkassembly.io/post/${paId}`;
  if (type === TYPE_COUNCIL_MOTION) {
    link = `https://${chain}.polkassembly.io/motion/${detail?.motionIndex}`;
  } else if (type === TYPE_DEMOCRACY_PROPOSAL) {
    link = `https://${chain}.polkassembly.io/proposal/${detail?.proposalIndex}`;
  } else if (type === TYPE_DEMOCRACY_REFERENDUM) {
    link = `https://${chain}.polkassembly.io/referendum/${detail?.referendumIndex}`;
  } else if (type === TYPE_TECH_COMM_MOTION) {
    link = `https://${chain}.polkassembly.io/tech/${detail?.motionIndex}`;
  } else if (type === TYPE_TREASURY_BOUNTY) {
    link = `https://${chain}.polkassembly.io/bounty/${detail?.bountyIndex}`;
  } else if (type === TYPE_TREASURY_CHILD_BOUNTY) {
    link = `https://${chain}.polkassembly.io/child_bounty/${detail?.index}`;
  } else if (type === TYPE_TREASURY_PROPOSAL) {
    link = `https://${chain}.polkassembly.io/treasury/${detail?.proposalIndex}`;
  } else if (type === TYPE_TREASURY_TIP) {
    link = `https://${chain}.polkassembly.io/tip/${detail?.hash}`;
  }

  return (
    <Wrapper ref={btnRef}>
      <a href={link} target="_blank" rel="noreferrer">
        <Button secondary>Comment on Polkassembly</Button>
      </a>
    </Wrapper>
  );
}
