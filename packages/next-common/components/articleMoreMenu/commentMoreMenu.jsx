import React, { useCallback, useRef, useState } from "react";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "../comment/context";
import nextApi from "next-common/services/nextApi";
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

const DeletePopup = dynamicPopup(() =>
  import("next-common/components/deletePopup"),
);

export default function CommentMoreMenu({
  editable,
  setIsEdit,
  customDeleteComment,
}) {
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
          deletePost={customDeleteComment || deleteComment}
        />
      )}
    </div>
  );
}
