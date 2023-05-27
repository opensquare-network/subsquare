import PostMetaBase from "../../container/postMeta/metaBase";
import React from "react";
import { TreasuryTag as TreasuryStateTag } from "../../../tags/state/treasury";
import { usePostState } from "../../../../context/post";
import CommonTreasuryMetaItems from "../common/commonMetaItems";

export default function TreasuryProposalPostMeta() {
  const state = usePostState();

  return <PostMetaBase state={ <TreasuryStateTag state={ state } /> }>
    <CommonTreasuryMetaItems />
  </PostMetaBase>;
}
