import { usePostState } from "../../../../context/post";
import PostMetaBase from "../../container/postMeta/metaBase";
import { BountyTag } from "../../../tags/state/treasury";
import CommonTreasuryMetaItems from "./commonMetaItems";
import React from "react";

export default function BountyPostMeta() {
  const state = usePostState();

  return <PostMetaBase state={ <BountyTag state={ state } /> }>
    <CommonTreasuryMetaItems />
  </PostMetaBase>;
}
