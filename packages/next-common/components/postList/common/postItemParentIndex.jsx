import React from "react";
import { MobileHiddenInfo } from "../styled";
import Anchor from "next-common/components/styled/anchor";

export default function PostItemParentIndex({ parentIndex }) {
  if (!parentIndex) {
    return null;
  }
  return (
    <MobileHiddenInfo>
      <Anchor href={`/treasury/bounties/${parentIndex}`} passHref>
        {`Parent #${parentIndex}`}
      </Anchor>
    </MobileHiddenInfo>
  );
}
