import React, { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./actions/articleActions";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import NonEdited from "./detail/common/NonEdited";
import PostContent from "./detail/common/PostContent";
import { useDispatch, useSelector } from "react-redux";
import { usePost, usePostDispatch, usePostType } from "../context/post";
import isPostAuthor from "../context/post/isPostAuthor";
import { getBannerUrl } from "../utils/banner";
import { toApiType } from "../utils/viewfuncs";
import updatePost from "../utils/viewfuncs/updatePost";
import { newErrorToast } from "../store/reducers/toastSlice";
import { isLoginSelector, userSelector } from "../store/reducers/userSlice";
import isThumbUp from "../context/post/isThumbUp";

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
  votes,
  myVote,
  chain,
  onReply,
  setIsEdit,
}) {
  const postDispatch = usePostDispatch();
  const dispatch = useDispatch();
  const post = usePost();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);

  const isLogin = useSelector(isLoginSelector);
  const user = useSelector(userSelector);
  const type = usePostType();
  const isAuthor = isPostAuthor(user, post, type);
  const thumbUp = isThumbUp(user, post);

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
        await updatePost(type, post._id, postDispatch);
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
        <NonEdited setIsEdit={setIsEdit} authors={post.authors}/>
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
