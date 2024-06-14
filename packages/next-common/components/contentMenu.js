import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDetailType } from "../context/page";
import { usePost } from "../context/post";
import { detailPageCategory } from "../utils/consts/business/category";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { OptionItem, OptionWrapper } from "./internalDropdown/styled";
import {
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
import dynamic from "next/dynamic";

const DeletePopup = dynamic(() => import("./deletePopup"), {
  ssr: false,
});

const ReportPopup = dynamic(() => import("./reportPopup"), {
  ssr: false,
});

const PostLinkPopup = dynamic(() => import("./linkPost/postLinkPopup"), {
  ssr: false,
});

const PostUnlinkPopup = dynamic(() => import("./linkPost/postUnlinkPopup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: relative;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

function LinkMenuItem({ setShowLinkPopup, setShow }) {
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

function UnlinkMenuItem({ setShowUnlinkPopup, setShow }) {
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

function EditMenuItem({ setIsEdit, setShow }) {
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

function CopyMenuItem({ onCopy = noop }) {
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

function ReportMenuItem({ setShowReportPopup, setShow }) {
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

function DeleteMenuItem({ setShowDeletePopup, setShow }) {
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

export function CommentContextMenu({ editable, setIsEdit }) {
  const dispatch = useDispatch();
  const comment = useComment();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const router = useRouter();
  const isAdmin = useIsAdmin();

  useOnClickOutside(ref, () => setShow(false));

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
  }, [comment, router]);

  return (
    <Wrapper className="edit" ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && (
        <OptionWrapper>
          {editable && <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />}
          {(editable || isAdmin) && (
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

export function PostContextMenu({ editable, setIsEdit }) {
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
  const isAdmin = useIsAdmin();

  const isDiscussionPost = postType === detailPageCategory.POST;

  useOnClickOutside(ref, () => setShow(false));

  const deletePost = useCallback(async () => {
    const { error } = await nextApi.delete(`posts/${post._id}`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    router.replace("/discussions");
  }, [post, router]);

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
    <Wrapper className="edit" ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && (
        <OptionWrapper>
          {editable && (
            <>
              {!isDiscussionPost && linkOrUnlinkMenuItem}
              <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />
            </>
          )}
          {(editable || isAdmin) && isDiscussionPost && (
            <DeleteMenuItem
              setShowDeletePopup={setShowDeletePopup}
              setShow={setShow}
            />
          )}
          <ReportMenuItem
            setShowReportPopup={setShowReportPopup}
            setShow={setShow}
          />
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
    </Wrapper>
  );
}
