import PostMetaBase from "../../container/postMeta/metaBase";
import React from "react";
import { SpendTag } from "../../../tags/state/treasury";
import { usePostState } from "../../../../context/post";
import CommonTreasuryMetaItems from "../common/commonMetaItems";

export default function TreasurySpendPostMeta() {
  const state = usePostState();

  return (
    <PostMetaBase state={<SpendTag state={state} />}>
      <CommonTreasuryMetaItems />
    </PostMetaBase>
  );
}
