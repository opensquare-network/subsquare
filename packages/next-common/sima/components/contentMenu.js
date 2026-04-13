import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "next-common/components/comment/context";
import { usePost } from "next-common/context/post";
import PostLinkPopup from "next-common/components/linkPost/postLinkPopup";
import PostUnlinkPopup from "next-common/components/linkPost/postUnlinkPopup";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import {
  AppendMenuItem,
  LinkMenuItem,
  EditMenuItem,
  CopyMenuItem,
  UnlinkMenuItem,
  SpamMenuItem,
} from "next-common/components/articleMoreMenu/common";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import { useMarkSpamComment } from "next-common/noSima/actions/markSpamComment";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import dynamicPopup from "next-common/lib/dynamic/popup";

const MarkAsSpamPopup = dynamicPopup(() =>
  import("next-common/components/markAsSpamPopup"),
);

const Wrapper = styled.div`
  position: relative;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export function CommentContextMenu() {
  const comment = useComment();
  const [show, setShow] = useState(false);
  const [showSpamPopup, setShowSpamPopup] = useState(false);
  const ref = useRef();
  const isAdmin = useIsAdmin();
  const dispatch = useDispatch();
  const router = useRouter();
  const markSpamAction = useMarkSpamComment();
  const { ensureLogin } = useEnsureLogin();

  useClickAway(ref, () => setShow(false));

  const onCopy = () => {
    copy(
      `${window.location.origin}${window.location.pathname}${window.location.search}#${comment.cid}`,
    );
  };

  const markAsSpam = useCallback(async () => {
    if (!(await ensureLogin())) {
      return;
    }
    const { error } = await markSpamAction(comment);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    router.replace(router.asPath);
  }, [ensureLogin, markSpamAction, comment, dispatch, router]);

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && (
        <OptionWrapper>
          <CopyMenuItem onCopy={onCopy} />
          {isAdmin && (
            <SpamMenuItem
              onClick={() => {
                setShowSpamPopup(true);
                setShow(false);
              }}
            />
          )}
        </OptionWrapper>
      )}
      {showSpamPopup && (
        <MarkAsSpamPopup setShow={setShowSpamPopup} onConfirm={markAsSpam} />
      )}
    </Wrapper>
  );
}

export function PostContextMenu({ isAuthor, canEdit, setIsAppend, setIsEdit }) {
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);

  const [show, setShow] = useState(false);
  const ref = useRef();
  const post = usePost();
  const type = useDetailType();
  const isSimaDiscussion = type === detailPageCategory.POST;

  useClickAway(ref, () => setShow(false));

  let linkOrUnlinkMenuItem = (
    <LinkMenuItem
      onClick={() => {
        setShowLinkPopup(true);
        setShow(false);
      }}
    />
  );
  if (post?.isBoundDiscussion) {
    linkOrUnlinkMenuItem = (
      <UnlinkMenuItem
        onClick={() => {
          setShowUnlinkPopup(true);
          setShow(false);
        }}
      />
    );
  }

  return (
    <>
      <Wrapper ref={ref}>
        <SystemMore
          className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
          onClick={() => setShow(!show)}
        />
        {show && (
          <OptionWrapper>
            {canEdit && (
              <>
                {isAuthor && !isSimaDiscussion && linkOrUnlinkMenuItem}
                {post.content ? (
                  <AppendMenuItem
                    onClick={() => {
                      setIsAppend(true);
                      setShow(false);
                    }}
                  />
                ) : (
                  <EditMenuItem
                    onClick={() => {
                      setIsEdit(true);
                      setShow(false);
                    }}
                  />
                )}
              </>
            )}
          </OptionWrapper>
        )}
      </Wrapper>
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
    </>
  );
}
