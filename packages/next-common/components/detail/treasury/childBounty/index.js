import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import BountyPostMeta from "../common/bountyMeta";
import ArticleContent from "../../../articleContent";
import React from "react";
import ChildBountyCountDown from "./countDown";

export default function ChildBountyDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <ChildBountyCountDown data={post.onchainData} />
    <PostTitle />
    <BountyPostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;

}
