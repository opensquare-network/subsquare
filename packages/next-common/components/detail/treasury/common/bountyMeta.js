import { usePostState } from "../../../../context/post";
import PostMetaBase from "../../container/postMeta/metaBase";
import { BountyTag, ChildBountyTag } from "../../../tags/state/treasury";
import CommonTreasuryMetaItems from "./commonMetaItems";
import React from "react";

export default function BountyPostMeta({ isChild = false }) {
  const state = usePostState();

  return (
    <PostMetaBase
      state={
        isChild ? <ChildBountyTag state={state} /> : <BountyTag state={state} />
      }
    >
      <CommonTreasuryMetaItems />
    </PostMetaBase>
  );
}
