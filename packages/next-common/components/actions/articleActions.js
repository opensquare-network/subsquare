import React, { useState } from "react";
import { Wrapper } from "./styled";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { usePost, usePostDispatch } from "../../context/post";
import { useIsPostAuthor } from "../../context/post/useIsPostAuthor";
import { useIsThumbUp } from "../../context/post/isThumbUp";
import ThumbsUp from "../thumbsUp";
import { PostContextMenu } from "../contentMenu";
import ThumbUpList from "./thumbUpList";
import { useIsLogin } from "../../context/user";
import { useFocusEditor } from "next-common/context/post/editor";
import { useDispatch } from "react-redux";
import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import { toApiType } from "next-common/utils/viewfuncs";
import fetchAndUpdatePost from "next-common/context/post/update";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export default function ArticleActions({ setIsEdit, extraActions }) {
  const isLogin = useIsLogin();
  const post = usePost();
  const isAuthor = useIsPostAuthor();
  const thumbsUp = useIsThumbUp();
  const focusEditor = useFocusEditor();
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const postDispatch = usePostDispatch();
  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);

  const type = useDetailType();
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

  return (
    <div className="mt-4 flex items-center justify-between">
      <Wrapper className="space-x-4">
        <ReplyButton onReply={focusEditor} noHover={!isLogin || isAuthor} />
        <ThumbsUp
          count={post?.reactions?.length}
          noHover={!isLogin || isAuthor}
          highlight={thumbsUp}
          toggleThumbUp={toggleThumbUp}
          thumbUpLoading={thumbUpLoading}
          showThumbsUpList={showThumbsUpList}
          setShowThumbsUpList={setShowThumbsUpList}
        />
        <Share />

        {extraActions}
      </Wrapper>

      {isLogin && <PostContextMenu editable={isAuthor} setIsEdit={setIsEdit} />}

      {showThumbsUpList && <ThumbUpList reactions={post?.reactions} />}
    </div>
  );
}
