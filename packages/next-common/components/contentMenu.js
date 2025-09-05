import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useDetailType } from "../context/page";
import { usePost } from "../context/post";
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
import useTerminateAction from "next-common/hooks/useTerminateAction";
import BountyAppendMenuItem from "next-common/components/appendants/bounty/appendMenuItem";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import ReferendaArticleMoreMenu from "./articleMoreMenu/referendaArticleMoreMenu";
import DiscussionArticleMoreMenu from "./articleMoreMenu/discussionArticleMoreMenu";
import {
  LinkMenuItem,
  DeleteMenuItem,
  EditMenuItem,
  ReportMenuItem,
  CopyMenuItem,
  UnlinkMenuItem,
} from "next-common/components/articleMoreMenu/common";

const DeletePopup = dynamicPopup(() => import("./deletePopup"));

const ReportPopup = dynamicPopup(() => import("./reportPopup"));

const PostLinkPopup = dynamicPopup(() => import("./linkPost/postLinkPopup"));

const PostUnlinkPopup = dynamicPopup(() =>
  import("./linkPost/postUnlinkPopup"),
);

const BountyCreateAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/bounty/createPopup"),
);

const ReferendaCreateAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/referenda/createPopup"),
);

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

function ConditionalBountyLinkMenu({ menu }) {
  const { appendants } = useBountyAppendantsContext();
  if (appendants && appendants?.length > 0) {
    return null;
  }

  return menu;
}

function ConditionalLinkMenu({
  menu,
  isTreasuryBountyPost,
  isFellowshipApplicationPost,
}) {
  if (isFellowshipApplicationPost) {
    return null;
  }

  if (isTreasuryBountyPost) {
    return <ConditionalBountyLinkMenu menu={menu} />;
  }

  return menu;
}

export function PostContextMenu(props) {
  const postType = useDetailType();
  if (postType === detailPageCategory.GOV2_REFERENDUM) {
    return <ReferendaArticleMoreMenu {...props} />;
  }
  if (postType === detailPageCategory.POST) {
    return <DiscussionArticleMoreMenu {...props} />;
  }
  return <_PostContextMenu {...props} />;
}

function _PostContextMenu({ isAuthor, editable, setIsEdit }) {
  const post = usePost();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const postType = useDetailType();
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showBountyCreatePopup, setShowBountyCreatePopup] = useState(false);
  const [showReferendaCreatePopup, setShowReferendaCreatePopup] =
    useState(false);
  const { actionsComponent, popupComponent } =
    useTerminateAction({
      onShowPopup: () => setShow(false),
    }) || {};

  const isFellowshipApplicationPost =
    postType === detailPageCategory.FELLOWSHIP_APPLICATION;

  const isTreasuryBountyPost = postType === detailPageCategory.TREASURY_BOUNTY;

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
          {isTreasuryBountyPost && (
            <BountyAppendMenuItem
              setShow={setShow}
              setIsAppend={setShowBountyCreatePopup}
            />
          )}
          {editable && isAuthor && (
            <ConditionalLinkMenu
              menu={linkOrUnlinkMenuItem}
              isTreasuryBountyPost={isTreasuryBountyPost}
              isFellowshipApplicationPost={isFellowshipApplicationPost}
            />
          )}
          {actionsComponent}
          <ReportMenuItem
            onClick={() => {
              setShow(false);
              setShowReportPopup(true);
            }}
          />
        </OptionWrapper>
      )}
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
      {showReportPopup && <ReportPopup setShow={setShowReportPopup} />}
      {showBountyCreatePopup && (
        <BountyCreateAppendantPopup setIsAppend={setShowBountyCreatePopup} />
      )}
      {showReferendaCreatePopup && (
        <ReferendaCreateAppendantPopup
          setIsAppend={setShowReferendaCreatePopup}
        />
      )}
      {popupComponent}
    </Wrapper>
  );
}
