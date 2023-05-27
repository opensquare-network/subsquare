import React from "react";
import { usePostState } from "../../../../context/post";
import PostMetaBase from "../../container/postMeta/metaBase";
import { TipTag } from "../../../tags/state/treasury";
import { TipStateMap } from "../../../../utils/viewfuncs/treasury/normalizeTipListItem";
import CommonTreasuryMetaItems from "../common/commonMetaItems";

export default function TipPostMeta() {
  const state = usePostState();

  return <PostMetaBase state={ <TipTag state={ TipStateMap[state] } /> }>
    <CommonTreasuryMetaItems />
  </PostMetaBase>;
}
