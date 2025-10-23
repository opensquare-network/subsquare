import React, { useCallback, useRef, useState } from "react";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "../comment/context";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useClickAway } from "react-use";
import {
  DeleteMenuItem,
  EditMenuItem,
  CopyMenuItem,
} from "next-common/components/articleMoreMenu/common";
import { useCurrentCommentAnchor } from "../comment/useCommentAnchor";
import { usePost } from "next-common/context/post";
import { useCommentActions } from "next-common/sima/context/commentActions";

const MaybeSimaDeletePopup = dynamicPopup(() =>
  import("next-common/components/deletePopup/maybeSima"),
);

export default function CommentMoreMenu({
  editable,
  setIsEdit,
  customDeleteComment,
}) {
  const dispatch = useDispatch();
  const comment = useComment();
  const post = usePost();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const currentCommentAnchor = useCurrentCommentAnchor();
  const { deleteComment: deleteCommentAction } = useCommentActions();

  useClickAway(ref, () => setShow(false));

  const onCopy = () => {
    copy(
      `${window.location.origin}${window.location.pathname}${window.location.search}#${currentCommentAnchor}`,
    );
  };

  const deleteComment = useCallback(async () => {
    const { error } = await deleteCommentAction(post, comment);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }
    router.replace(router.asPath);
  }, [deleteCommentAction, post, comment, dispatch, router]);

  return (
    <div ref={ref} className=" relative">
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
          {(editable || isAdmin) && (
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
        <MaybeSimaDeletePopup
          itemName="comment"
          setShow={setShowDeletePopup}
          deletePost={customDeleteComment || deleteComment}
          isSima={comment.dataSource === "sima"}
        />
      )}
    </div>
  );
}
