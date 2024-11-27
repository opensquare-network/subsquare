import React, { useState } from "react";
import { Wrapper } from "./styled";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { usePost } from "../../context/post";
import { useIsPostAuthor } from "../../context/post/useIsPostAuthor";
import ThumbsUp from "../thumbsUp";
import { PostContextMenu } from "../contentMenu";
import ThumbUpList from "./thumbUpList";
import { useUser } from "../../context/user";
import { useFocusEditor } from "next-common/context/post/editor";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useArticleActions } from "next-common/sima/context/articleActions";
import { useMyUpVote } from "next-common/context/post/useMyUpVote";
import useCanEditPost from "next-common/hooks/useCanEditPost";
import useShouldUseSimaPostEdit from "next-common/sima/hooks/useShouldUseSimaPostEdit";

function SimaPostContextMenu({ isAuthor, setIsEdit }) {
  const canEdit = useCanEditPost();
  return (
    <PostContextMenu
      isAuthor={isAuthor}
      editable={canEdit}
      setIsEdit={setIsEdit}
    />
  );
}

function MaybeSimaPostContextMenu({ isAuthor, setIsEdit }) {
  const isSima = useShouldUseSimaPostEdit();
  if (isSima) {
    return <SimaPostContextMenu isAuthor={isAuthor} setIsEdit={setIsEdit} />;
  }
  return (
    <PostContextMenu
      isAuthor={isAuthor}
      editable={isAuthor}
      setIsEdit={setIsEdit}
    />
  );
}

export default function ArticleActions({ setIsEdit, extraActions }) {
  const user = useUser();
  const post = usePost();
  const isAuthor = useIsPostAuthor();
  const myUpVote = useMyUpVote();
  const thumbsUp = !!myUpVote;
  const focusEditor = useFocusEditor();
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const dispatch = useDispatch();
  const [thumbUpLoading, setThumbUpLoading] = useState(false);

  const { upVote, cancelUpVote, reloadPost } = useArticleActions();

  const toggleThumbUp = async () => {
    if (!user || isAuthor || thumbUpLoading) {
      return;
    }

    setThumbUpLoading(true);
    try {
      let result, error;

      if (thumbsUp) {
        ({ result, error } = await cancelUpVote(post));
      } else {
        ({ result, error } = await upVote(post));
      }

      if (result) {
        await reloadPost();
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setThumbUpLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Wrapper className="space-x-4">
          <ReplyButton onReply={focusEditor} noHover={!user || isAuthor} />
          <ThumbsUp
            count={post?.reactions?.length}
            noHover={!user || isAuthor}
            highlight={thumbsUp}
            toggleThumbUp={toggleThumbUp}
            thumbUpLoading={thumbUpLoading}
            showThumbsUpList={showThumbsUpList}
            setShowThumbsUpList={setShowThumbsUpList}
          />
          <Share />

          {extraActions}
        </Wrapper>

        {user && (
          <MaybeSimaPostContextMenu isAuthor={isAuthor} setIsEdit={setIsEdit} />
        )}
      </div>

      {showThumbsUpList && <ThumbUpList reactions={post?.reactions} />}
    </div>
  );
}
