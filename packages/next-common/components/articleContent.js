import React from "react";
import styled from "styled-components";
import ArticleActions from "./actions/articleActions";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import NonEdited from "./detail/common/NonEdited";
import PostContent from "./detail/common/PostContent";
import { usePost } from "../context/post";
import { getBannerUrl } from "../utils/banner";
import { isPostEdited } from "next-common/utils/post";

const Wrapper = styled(RichTextStyleWrapper)`
  :hover {
    .edit {
      display: block;
    }
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: var(--textTertiary);
`;

const BannerImage = styled.img`
  width: 100%;
`;

export default function ArticleContent({
  votes,
  myVote,
  setIsEdit,
  className = "",
}) {
  const post = usePost();

  const bannerUrl = getBannerUrl(post.bannerCid);

  return (
    <Wrapper className={className}>
      {!post.content && (
        <NonEdited setIsEdit={setIsEdit} authors={post.authors} />
      )}
      {bannerUrl && <BannerImage src={bannerUrl} alt="banner image" />}
      <PostContent />
      {isPostEdited(post) && <EditedLabel>Edited</EditedLabel>}
      {post.poll && (
        <>
          <Divider margin={16} />
          <Poll poll={post.poll} votes={votes} myVote={myVote} />
        </>
      )}
      <PostDataSource />
      <ArticleActions setIsEdit={setIsEdit} />
    </Wrapper>
  );
}
