import React from "react";
import { Wrapper } from "./styled";
import ReplyButton from "./replyButton";
import Share from "../shareSNS";
import { usePost } from "../../context/post";
import { useIsPostAuthor } from "../../context/post/useIsPostAuthor";
import { useIsThumbUp } from "../../context/post/isThumbUp";
import useThumbsUp from "../thumbsUp";
import ContentMenu from "../contentMenu";
import ThumbUpList from "./thumbUpList";
import { useIsLogin } from "../../context/user";
import { useFocusEditor } from "next-common/context/post/editor";

export default function ArticleActions({
  toggleThumbUp,
  thumbUpLoading,
  setIsEdit,
  setShowLinkPopup,
  setShowUnlinkPopup,
  setShowReportPopup,
}) {
  const isLogin = useIsLogin();
  const post = usePost();
  const isAuthor = useIsPostAuthor();
  const thumbsUp = useIsThumbUp();
  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count: post?.reactions?.length,
    noHover: !isLogin || isAuthor,
    highlight: thumbsUp,
    toggleThumbUp,
    thumbUpLoading,
  });
  const focusEditor = useFocusEditor();

  return (
    <>
      <Wrapper>
        <ReplyButton onReply={focusEditor} noHover={!isLogin || isAuthor} />
        {ThumbsUpComponent}
        <Share />
        {isLogin && (
          <ContentMenu
            edit={isAuthor}
            report={true}
            setShowReportPopup={setShowReportPopup}
            setIsEdit={setIsEdit}
            setShowLinkPopup={setShowLinkPopup}
            setShowUnlinkPopup={setShowUnlinkPopup}
            alwaysShow
          />
        )}
      </Wrapper>

      <ThumbUpList
        showThumbsUpList={showThumbsUpList}
        reactions={post?.reactions}
      />
    </>
  );
}
