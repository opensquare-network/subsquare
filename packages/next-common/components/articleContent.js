import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { toApiType } from "next-common/utils/viewfuncs";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ArticleActions from "./actions/articleActions";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import { getBannerUrl } from "../utils/banner";
import NonEdited from "./detail/common/NonEdited";
import PostContent from "./detail/common/PostContent";
import { isLoginSelector } from "../store/reducers/userSlice";
import { isPostAuthorSelector, thumbsUpSelector } from "../store/selectors/post";
import { fetchPost } from "../store/reducers/postSlice";

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
  color: ${(props) => props.theme.textTertiary};
`;

const BannerImage = styled.img`
  width: 100%;
`;

export default function ArticleContent({
  post,
  votes,
  myVote,
  chain,
  onReply,
  type,
  setIsEdit,
}) {
  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  if (!post) {
    return null;
  }

  const isLogin = useSelector(isLoginSelector);
  const isAuthor = useSelector(isPostAuthorSelector);
  const thumbUp = useSelector(thumbsUpSelector);

  const toggleThumbUp = async () => {
    if (!isLogin || isAuthor || thumbUpLoading) {
      return
    }

    setThumbUpLoading(true);
    try {
      let result, error;

      if (thumbUp) {
        ({ result, error } = await nextApi.delete(
          `${toApiType(type)}/${post._id}/reaction`
        ));
      } else {
        ({ result, error } = await nextApi.put(
          `${toApiType(type)}/${post._id}/reaction`,
          { reaction: 1 },
          { credentials: "include" }
        ));
      }

      if (result) {
        dispatch(fetchPost(type, post._id))
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } finally {
      setThumbUpLoading(false);
    }
  };

  const bannerUrl = getBannerUrl(post.bannerCid);

  return (
    <Wrapper>
      <Divider margin={16} />
      {post.content === "" && (
        <NonEdited type={type} setIsEdit={setIsEdit} authors={post.authors}/>
      )}
      {bannerUrl && (
        <BannerImage src={bannerUrl} alt="banner image" />
      )}
      <PostContent />
      {post.createdAt !== post.updatedAt && (
        <EditedLabel>Edited</EditedLabel>
      )}
      {post.poll && (
        <>
          <Divider margin={16} />
          <Poll
            chain={chain}
            poll={post.poll}
            votes={votes}
            myVote={myVote}
          />
        </>
      )}
      <PostDataSource />
      <ArticleActions
        chain={chain}
        setIsEdit={setIsEdit}
        toggleThumbUp={toggleThumbUp}
        thumbUpLoading={thumbUpLoading}
        onReply={onReply}
      />
    </Wrapper>
  );
}
