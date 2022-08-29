import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { toApiType } from "next-common/utils/viewfuncs";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import User from "next-common/components/user";
import ArticleActions from "./actions/articleActions";
import PostEdit from "next-common/components/post/postEdit";
import EditIcon from "../assets/imgs/icons/edit.svg";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import { MarkdownPreviewer, HtmlPreviewer } from "@osn/previewer";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import { getShare2SNStext } from "../utils/post/share";

const Wrapper = styled(RichTextStyleWrapper)`
  :hover {
    .edit {
      display: block;
    }
  }
`;

const PlaceHolder = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.textTertiary};
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: ${(props) => props.theme.textSecondary};
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${(props) => props.theme.textTertiary};
`;

const Edit = styled.div`
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
  display: flex;
  align-items: center;

  svg {
    margin-left: 8px;
    margin-right: 4px;
  }
`;

const BannerImage = styled.img`
  width: 100%;
`;

export default function ArticleContent({
  user,
  post,
  votes,
  myVote,
  setPost,
  chain,
  onReply,
  type,
  isEdit,
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
      !!(user.addresses || []).find((item) =>
        post?.authors?.includes(item.address)
      );
  }

  const thumbUp =
    isLoggedIn &&
    post.reactions?.findIndex((r) => r.user?.username === user.username) > -1;

  const updatePost = async () => {
    const url = `${toApiType(type)}/${post._id}`;
    const { result: newPost } = await nextApi.fetch(url);
    if (newPost) {
      setPost(newPost);
    }
  };

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

  return (
    <Wrapper>
      {!isEdit && (
        <>
          <Divider margin={16} />
          {post.content === "" && (
            <PlaceHolder>
              {`The ${type} has not been edited by creator.`}
              {ownPost && (
                <Edit
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <EditIcon />
                  Edit
                </Edit>
              )}
            </PlaceHolder>
          )}
          {post.content === "" && (
            <GreyWrapper>
              <span style={{ marginRight: 12 }}>Who can edit?</span>
              {(post.authors || []).map((author) => (
                <GreyItem key={author}>
                  <User
                    add={author}
                    chain={chain}
                    showAvatar={false}
                    fontSize={12}
                  />
                </GreyItem>
              ))}
            </GreyWrapper>
          )}
          {post.bannerUrl && (
            <BannerImage src={post.bannerUrl} alt="banner image" />
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
          {["kusama", "polkadot"].includes(chain) && (
            <PostDataSource type={type} post={post} />
          )}
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
        </>
      )}
      {isEdit && (
        <PostEdit
          chain={chain}
          postData={post}
          setIsEdit={setIsEdit}
          updatePost={updatePost}
          type={type}
        />
      )}
    </Wrapper>
  );
}
