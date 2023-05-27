import React from "react";
import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";
import DetailContentBase from "../../common/detailBase";
import PostTitle from "../../common/Title";
import BountyPostMeta from "../common/bountyMeta";
import ArticleContent from "../../../articleContent";
import BountyCountDown from "../common/bountyCountDown";

export default function BountyDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return <DetailContentBase>
    <BountyCountDown data={post.onchainData} />
    <PostTitle />
    <BountyPostMeta />
    <ArticleContent
      post={post}
      onReply={onReply}
      setIsEdit={setIsEdit}
    />
  </DetailContentBase>;

}
