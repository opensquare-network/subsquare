import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useDetailType } from "../context/page";
import { detailPageCategory } from "../utils/consts/business/category";
import { OptionWrapper } from "./internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "./comment/context";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useClickAway } from "react-use";
import ReferendaArticleMoreMenu from "./articleMoreMenu/referendaArticleMoreMenu";
import DiscussionArticleMoreMenu from "./articleMoreMenu/discussionArticleMoreMenu";
import TreasuryBountyAricleMoreMenu from "./articleMoreMenu/treasuryBountyAricleMoreMenu";
import FellowshipApplicationArticleMoreMenu from "./articleMoreMenu/fellowshipApplicationArticleMoreMenu";
import {
  DeleteMenuItem,
  EditMenuItem,
  CopyMenuItem,
  ReportMenu,
  LinkOrUnlinkMenu,
} from "next-common/components/articleMoreMenu/common";

const DeletePopup = dynamicPopup(() => import("./deletePopup"));

const Wrapper = styled.div`
  position: relative;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export function CommentContextMenu({ editable, setIsEdit }) {
  const dispatch = useDispatch();
  const comment = useComment();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const router = useRouter();
  const isAdmin = useIsAdmin();

  useClickAway(ref, () => setShow(false));

  const onCopy = () => {
    copy(
      `${window.location.origin}${window.location.pathname}${window.location.search}#${comment.height}`,
    );
  };

  const deleteComment = useCallback(async () => {
    const { error } = await nextApi.delete(`comments/${comment._id}`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    router.replace(router.asPath);
  }, [comment._id, dispatch, router]);

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && (
        <OptionWrapper>
          {editable && (
            <EditMenuItem
              onClick={() => {
                setIsEdit(true);
                setShow(false);
              }}
            />
          )}
          {comment?.dataSource !== "sima" && (editable || isAdmin) && (
            <DeleteMenuItem
              onClick={() => {
                setShowDeletePopup(true);
                setShow(false);
              }}
            />
          )}

          <CopyMenuItem onCopy={onCopy} />
        </OptionWrapper>
      )}
      {showDeletePopup && (
        <DeletePopup
          itemName="comment"
          setShow={setShowDeletePopup}
          deletePost={deleteComment}
        />
      )}
    </Wrapper>
  );
}

export function PostContextMenu(props) {
  const postType = useDetailType();
  if (postType === detailPageCategory.GOV2_REFERENDUM) {
    return <ReferendaArticleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.POST) {
    return <DiscussionArticleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.TREASURY_BOUNTY) {
    return <TreasuryBountyAricleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.FELLOWSHIP_APPLICATION) {
    return <FellowshipApplicationArticleMoreMenu {...props} />;
  }
  return <_PostContextMenu {...props} />;
}

function _PostContextMenu({ isAuthor, editable, setIsEdit }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  useClickAway(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      <OptionWrapper className={!show && "hidden"}>
        {editable && (
          <EditMenuItem
            onClick={() => {
              setIsEdit(true);
              setShow(false);
            }}
          />
        )}
        {editable && isAuthor && <LinkOrUnlinkMenu setShow={setShow} />}
        <ReportMenu setShow={setShow} />
      </OptionWrapper>
    </Wrapper>
  );
}
