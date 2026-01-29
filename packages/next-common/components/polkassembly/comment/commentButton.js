import React from "react";
import styled from "styled-components";
import PrimaryButton from "next-common/lib/button/primary";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "next-common/context/page";

const Wrapper = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function PolkassemblyCommentButton({ detail, paId, btnRef }) {
  const { usePolkassemblyBackupData } = useChainSettings();
  const detailType = useDetailType();
  const chain = useChain();
  let type = detailType;

  if (usePolkassemblyBackupData) {
    return null;
  }

  // For external post, use the motion link if it is ref to a motion
  if (type === detailPageCategory.DEMOCRACY_EXTERNAL) {
    if (detail?.refToPost?.postType === "motion") {
      type = detailPageCategory.COUNCIL_MOTION;
    } else if (
      detail?.refToPost?.postType === "democracy" &&
      detail?.referendumIndex !== undefined
    ) {
      type = detailPageCategory.DEMOCRACY_REFERENDUM;
    }
  }

  let link = getPolkassemblyLink(type, detail);
  if (!link) {
    link = `https://${chain}.polkassembly.io/post/${paId}`;
  }

  return (
    <Wrapper ref={btnRef}>
      <a href={link} target="_blank" rel="noreferrer">
        <PrimaryButton>Comment on Polkassembly</PrimaryButton>
      </a>
    </Wrapper>
  );
}
