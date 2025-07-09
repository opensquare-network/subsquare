import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDetailType } from "../context/page";
import { usePost } from "../context/post";
import { detailPageCategory } from "../utils/consts/business/category";
import { OptionItem, OptionWrapper } from "./internalDropdown/styled";
import {
  SystemCancel,
  SystemCopied,
  SystemCopy,
  SystemEdit,
  SystemFlag,
  SystemLink,
  SystemMore,
  SystemTrash,
} from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { noop } from "lodash-es";
import { useComment } from "./comment/context";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useClickAway } from "react-use";
import CancelReferendumPopup from "./summary/newProposalQuickStart/cancelReferendumInnerPopup";
import KillReferendumPopup from "./summary/newProposalQuickStart/killReferendumInnerPopup";
import { useChainSettings } from "next-common/context/chain";
import useTerminateAction from "next-common/hooks/useTerminateAction";
import BountyAppendMenuItem from "next-common/components/appendants/bounty/appendMenuItem";
import ReferendaAppendMenuItem from "next-common/components/appendants/referenda/appendMenuItem";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";

const DeletePopup = dynamicPopup(() => import("./deletePopup"));

const ReportPopup = dynamicPopup(() => import("./reportPopup"));

const PostLinkPopup = dynamicPopup(() => import("./linkPost/postLinkPopup"));

const PostUnlinkPopup = dynamicPopup(() =>
  import("./linkPost/postUnlinkPopup"),
);

const BountyEditorAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/bounty/appendantEditorPopup"),
);

const ReferendaAppendantEditorPopup = dynamicPopup(() =>
  import("next-common/components/appendants/referenda/appendantEditorPopup"),
);

const Wrapper = styled.div`
  position: relative;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export function LinkMenuItem({ setShowLinkPopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShowLinkPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemLink />
      </div>
      <span>Link</span>
    </OptionItem>
  );
}

export function UnlinkMenuItem({ setShowUnlinkPopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShowUnlinkPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemLink />
      </div>
      <span>Unlink</span>
    </OptionItem>
  );
}

export function EditMenuItem({ setIsEdit, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setIsEdit(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemEdit />
      </div>
      <span>Edit</span>
    </OptionItem>
  );
}

export function CopyMenuItem({ onCopy = noop }) {
  const [copyState, setCopyState] = useState(false);

  useEffect(() => {
    if (copyState) {
      setTimeout(() => {
        setCopyState(false);
      }, 3000);
    }
  }, [copyState]);

  return (
    <OptionItem
      onClick={() => {
        try {
          onCopy();
        } catch (e) {
          // fixme: we should not ignore
        } finally {
          setCopyState(true);
        }
      }}
    >
      <div className="mr-2">
        {copyState ? <SystemCopied /> : <SystemCopy />}
      </div>
      <span>{copyState ? "Copied" : "Copy Link"}</span>
    </OptionItem>
  );
}

export function ReportMenuItem({ setShowReportPopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShow(false);
        setShowReportPopup(true);
      }}
    >
      <div className="mr-2">
        <SystemFlag />
      </div>
      <span>Report</span>
    </OptionItem>
  );
}

export function DeleteMenuItem({ setShowDeletePopup, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setShowDeletePopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemTrash />
      </div>
      <span>Delete</span>
    </OptionItem>
  );
}

export function CancelReferendumMenuItem({
  setShowCancelReferendumPopup,
  setShow,
}) {
  return (
    <OptionItem
      onClick={() => {
        setShowCancelReferendumPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemCancel />
      </div>
      <span>Cancel</span>
    </OptionItem>
  );
}

export function KillReferendumMenuItem({
  setShowKillReferendumPopup,
  setShow,
}) {
  return (
    <OptionItem
      onClick={() => {
        setShowKillReferendumPopup(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <SystemTrash />
      </div>
      <span>Kill</span>
    </OptionItem>
  );
}

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
          {editable && <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />}
          {comment?.dataSource !== "sima" && (editable || isAdmin) && (
            <DeleteMenuItem
              setShowDeletePopup={setShowDeletePopup}
              setShow={setShow}
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

function ConditionalOpenGovReferendumLinkMenu({ menu }) {
  const { appendants } = useReferendaAppendantsContext();
  if (appendants && appendants?.length > 0) {
    return null;
  }

  return menu;
}

function ConditionalLinkMenu({
  menu,
  isTreasuryBountyPost,
  isDiscussionPost,
  isFellowshipApplicationPost,
  isOpenGovReferendumPost,
}) {
  if (isDiscussionPost || isFellowshipApplicationPost) {
    return null;
  }

  if (isTreasuryBountyPost) {
    return <ConditionalBountyLinkMenu menu={menu} />;
  }

  if (isOpenGovReferendumPost) {
    return <ConditionalOpenGovReferendumLinkMenu menu={menu} />;
  }

  return menu;
}

export function PostContextMenu({ isAuthor, editable, setIsEdit }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const post = usePost();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const postType = useDetailType();
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCancelReferendumPopup, setShowCancelReferendumPopup] =
    useState(false);
  const [showKillReferendumPopup, setShowKillReferendumPopup] = useState(false);
  const [showBountyAppendPopup, setShowBountyAppendPopup] = useState(false);
  const [
    showOpenGovReferendumAppendPopup,
    setShowOpenGovReferendumAppendPopup,
  ] = useState(false);
  const isAdmin = useIsAdmin();
  const { actionsComponent, popupComponent } =
    useTerminateAction({
      onShowPopup: () => setShow(false),
    }) || {};

  const { newProposalQuickStart: { cancelReferendum, killReferendum } = {} } =
    useChainSettings();

  const isOpenGovReferendumPost =
    postType === detailPageCategory.GOV2_REFERENDUM;
  const isDiscussionPost = postType === detailPageCategory.POST;
  const isFellowshipApplicationPost =
    postType === detailPageCategory.FELLOWSHIP_APPLICATION;
  const isSimaDiscussion = post.sima;
  const canDelete =
    (editable || isAdmin) && isDiscussionPost && !isSimaDiscussion;

  const isTreasuryBountyPost = postType === detailPageCategory.TREASURY_BOUNTY;

  useClickAway(ref, () => setShow(false));

  const deletePost = useCallback(async () => {
    const { error } = await nextApi.delete(`posts/${post._id}`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    router.replace("/discussions");
  }, [dispatch, post._id, router]);

  let linkOrUnlinkMenuItem = (
    <LinkMenuItem setShowLinkPopup={setShowLinkPopup} setShow={setShow} />
  );
  if (post?.isBoundDiscussion) {
    linkOrUnlinkMenuItem = (
      <UnlinkMenuItem
        setShowUnlinkPopup={setShowUnlinkPopup}
        setShow={setShow}
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
          {editable && <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />}
          {isTreasuryBountyPost && (
            <BountyAppendMenuItem
              setShow={setShow}
              setIsAppend={setShowBountyAppendPopup}
            />
          )}
          {isOpenGovReferendumPost && (
            <ReferendaAppendMenuItem
              setShow={setShow}
              setIsAppend={setShowOpenGovReferendumAppendPopup}
            />
          )}
          {editable && isAuthor && (
            <ConditionalLinkMenu
              menu={linkOrUnlinkMenuItem}
              isTreasuryBountyPost={isTreasuryBountyPost}
              isDiscussionPost={isDiscussionPost}
              isFellowshipApplicationPost={isFellowshipApplicationPost}
              isOpenGovReferendumPost={isOpenGovReferendumPost}
            />
          )}
          {canDelete && (
            <DeleteMenuItem
              setShowDeletePopup={setShowDeletePopup}
              setShow={setShow}
            />
          )}
          {actionsComponent}
          <ReportMenuItem
            setShowReportPopup={setShowReportPopup}
            setShow={setShow}
          />
          {isOpenGovReferendumPost && (
            <>
              {cancelReferendum && (
                <CancelReferendumMenuItem
                  setShowCancelReferendumPopup={setShowCancelReferendumPopup}
                  setShow={setShow}
                />
              )}
              {killReferendum && (
                <KillReferendumMenuItem
                  setShowKillReferendumPopup={setShowKillReferendumPopup}
                  setShow={setShow}
                />
              )}
            </>
          )}
        </OptionWrapper>
      )}
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
      {showReportPopup && <ReportPopup setShow={setShowReportPopup} />}
      {showDeletePopup && (
        <DeletePopup
          itemName="post"
          setShow={setShowDeletePopup}
          deletePost={deletePost}
        />
      )}
      {showCancelReferendumPopup && (
        <CancelReferendumPopup
          referendumIndex={post?.referendumIndex}
          onClose={() => setShowCancelReferendumPopup(false)}
        />
      )}
      {showKillReferendumPopup && (
        <KillReferendumPopup
          referendumIndex={post?.referendumIndex}
          onClose={() => setShowKillReferendumPopup(false)}
        />
      )}
      {showBountyAppendPopup && (
        <BountyEditorAppendantPopup setIsAppend={setShowBountyAppendPopup} />
      )}
      {showOpenGovReferendumAppendPopup && (
        <ReferendaAppendantEditorPopup
          setIsAppend={setShowOpenGovReferendumAppendPopup}
        />
      )}
      {popupComponent}
    </Wrapper>
  );
}
