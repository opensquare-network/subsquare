import React, { useState } from "react";
import styled from "styled-components";
import ArticleActions from "./actions/articleActions";
import PostDataSource from "./postDataSource";
import Poll from "./poll";
import RichTextStyleWrapper from "./content/richTextStyleWrapper";
import Divider from "./styled/layout/divider";
import NonEdited from "./detail/common/NonEdited";
import PostContent from "./detail/common/PostContent";
import { useDispatch } from "react-redux";
import { usePost, usePostDispatch } from "../context/post";
import { useIsPostAuthor } from "../context/post/useIsPostAuthor";
import { getBannerUrl } from "../utils/banner";
import { toApiType } from "../utils/viewfuncs";
import { newErrorToast } from "../store/reducers/toastSlice";
import { useIsThumbUp } from "../context/post/isThumbUp";
import { useIsLogin } from "../context/user";
import nextApi from "next-common/services/nextApi";
import fetchAndUpdatePost from "../context/post/update";
import { useDetailType } from "../context/page";
import PostLinkPopup from "./linkPost/postLinkPopup";
import PostUnlinkPopup from "./linkPost/postUnlinkPopup";

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

export default function ArticleContent({ votes, myVote, onReply, setIsEdit }) {
  const postDispatch = usePostDispatch();
  const dispatch = useDispatch();
  const post = usePost();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);

  const isLogin = useIsLogin();
  const type = useDetailType();
  const isAuthor = useIsPostAuthor();
  const thumbUp = useIsThumbUp();

  const toggleThumbUp = async () => {
    if (!isLogin || isAuthor || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      let result, error;

      if (thumbUp) {
        ({ result, error } = await nextApi.delete(
          `${toApiType(type)}/${post._id}/reaction`,
        ));
      } else {
        ({ result, error } = await nextApi.put(
          `${toApiType(type)}/${post._id}/reaction`,
          { reaction: 1 },
          { credentials: "include" },
        ));
      }

      if (result) {
        await fetchAndUpdatePost(postDispatch, type, post._id);
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
    <Wrapper className="prose">
      {!post.content && (
        <NonEdited
          setIsEdit={setIsEdit}
          authors={post.authors}
          setShowLinkPopup={setShowLinkPopup}
        />
      )}
      {bannerUrl && <BannerImage src={bannerUrl} alt="banner image" />}
      <PostContent />
      {post.createdAt !== post.updatedAt && <EditedLabel>Edited</EditedLabel>}
      {post.poll && (
        <>
          <Divider margin={16} />
          <Poll poll={post.poll} votes={votes} myVote={myVote} />
        </>
      )}
      <PostDataSource />
      <ArticleActions
        setIsEdit={setIsEdit}
        toggleThumbUp={toggleThumbUp}
        thumbUpLoading={thumbUpLoading}
        onReply={onReply}
        setShowLinkPopup={setShowLinkPopup}
        setShowUnlinkPopup={setShowUnlinkPopup}
      />
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
    </Wrapper>
  );
}
