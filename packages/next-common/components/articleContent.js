import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { toApiType } from "next-common/utils/viewfuncs";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ArticleActions from "./actions/articleActions";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import { getShare2SNStext } from "../utils/post/share";
import { getBannerUrl } from "../utils/banner";
import NonEdited from "./detail/common/NonEdited";
import updatePost from "../utils/viewfuncs/updatePost";

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
  user,
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

  const isLoggedIn = !!user;
  let ownPost = false;
  if (type === "post") {
    ownPost = isLoggedIn && post.author?.username === user.username;
  } else {
    ownPost =
      isLoggedIn &&
      post?.authors?.includes(user.address);
  }

  const thumbUp =
    isLoggedIn &&
    post.reactions?.findIndex((r) => r.user?.username === user.username) > -1;

  const toggleThumbUp = async () => {
    if (isLoggedIn && !ownPost && !thumbUpLoading) {
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
          await updatePost();
        }
        if (error) {
          dispatch(newErrorToast(error.message));
        }
      } finally {
        setThumbUpLoading(false);
      }
    }
  };

  const bannerUrl = getBannerUrl(post.bannerCid);

  return (
    <Wrapper>
      <Divider margin={16} />
      {post.content === "" && (
        <NonEdited type={type} isAuthor={ownPost} setIsEdit={setIsEdit} authors={post.authors}/>
      )}
      {bannerUrl && (
        <BannerImage src={bannerUrl} alt="banner image" />
      )}
      {post.contentType === "markdown" && (
        <MarkdownPreviewer content={post.content} />
      )}
      {post.contentType === "html" && (
        <HtmlPreviewer content={post.content} />
      )}
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
      <PostDataSource type={type} post={post} />
      <ArticleActions
        chain={chain}
        highlight={isLoggedIn && thumbUp}
        noHover={!isLoggedIn || ownPost}
        edit={ownPost}
        setIsEdit={setIsEdit}
        toggleThumbUp={toggleThumbUp}
        reactions={post?.reactions}
        onReply={onReply}
        share2SNStext={getShare2SNStext(post, type)}
      />
    </Wrapper>
  );
}
