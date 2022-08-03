import React from "react";
import styled from "styled-components";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { detailPageCategory } from "next-common/utils/consts/business/category";

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
  if (type === detailPageCategory.COUNCIL_MOTION) {
    link = `https://${chain}.polkassembly.io/motion/${detail?.motionIndex}`;
  } else if (type === detailPageCategory.DEMOCRACY_REFERENDUM) {
    link = `https://${chain}.polkassembly.io/proposal/${detail?.proposalIndex}`;
  } else if (type === detailPageCategory.DEMOCRACY_REFERENDUM) {
    link = `https://${chain}.polkassembly.io/referendum/${detail?.referendumIndex}`;
  } else if (type === detailPageCategory.TECH_COMM_MOTION) {
    link = `https://${chain}.polkassembly.io/tech/${detail?.motionIndex}`;
  } else if (type === detailPageCategory.TREASURY_BOUNTY) {
    link = `https://${chain}.polkassembly.io/bounty/${detail?.bountyIndex}`;
  } else if (type === detailPageCategory.TREASURY_CHILD_BOUNTY) {
    link = `https://${chain}.polkassembly.io/child_bounty/${detail?.index}`;
  } else if (type === detailPageCategory.TREASURY_PROPOSAL) {
    link = `https://${chain}.polkassembly.io/treasury/${detail?.proposalIndex}`;
  } else if (type === detailPageCategory.TREASURY_TIP) {
    link = `https://${chain}.polkassembly.io/tip/${detail?.hash}`;
  }

  return (
    <Wrapper ref={btnRef}>
      <a href={link} target="_blank" rel="noreferrer">
        <SecondaryButton>Comment on Polkassembly</SecondaryButton>
      </a>
    </Wrapper>
  );
}
