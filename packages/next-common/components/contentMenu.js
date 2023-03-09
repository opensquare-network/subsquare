import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { usePost } from "../context/post";
import nextApi from "../services/nextApi";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { postTypeToApi } from "../utils/viewfuncs";
import { OptionItem, OptionWrapper } from "./internalDropdown/styled";
import { addToast } from "../store/reducers/toastSlice";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  margin-left: auto;
  position: relative;
  display: none;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  ${(p) =>
    p.active &&
    css`
      display: block;
    `}
`;

export default function ContentMenu({
  edit,
  setIsEdit,
  setShowLinkPopup,
  copy = false,
  onCopy,
  alwaysShow,
}) {
  const post = usePost();
  const [show, setShow] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const ref = useRef();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (copyState) {
      setTimeout(() => {
        setCopyState(false);
      }, 3000);
    }
  }, [copyState]);

  useOnClickOutside(ref, () => setShow(false));

  const { postType: rootPostType, postId: rootPostId } = post?.rootPost || {};
  const unlinkDiscussion = useCallback(async () => {
    setShow(false);

    const { error, result } = await nextApi.post(
      `${postTypeToApi(rootPostType)}/${rootPostId}/unbind`
    );
    if (error) {
      dispatch(addToast({ message: error.message, type: "error" }));
    }
    if (result) {
      dispatch(addToast({ message: "Unlinked", type: "success" }));
      // reload the server data
      router.replace(router.asPath);
    }
  }, [dispatch, rootPostType, rootPostId, router]);

  let linkOrUnlinkMenuItem = (
    <OptionItem
      onClick={() => {
        setShowLinkPopup(true);
        setShow(false);
      }}
    >
      Link
    </OptionItem>
  );
  if (post?.isBoundDiscussion) {
    linkOrUnlinkMenuItem = (
      <OptionItem onClick={unlinkDiscussion}>Unlink</OptionItem>
    );
  }

  return (
    <Wrapper className="edit" active={show || alwaysShow} ref={ref}>
      <img
        alt=""
        src="/imgs/icons/more.svg"
        onClick={() => setShow(!show)}
        width={24}
        height={24}
      />
      {show && (
        <OptionWrapper>
          {edit && (
            <>
              <OptionItem
                onClick={() => {
                  setIsEdit(true);
                  setShow(false);
                }}
              >
                Edit
              </OptionItem>
              {linkOrUnlinkMenuItem}
            </>
          )}
          {copy && (
            <OptionItem
              onClick={() => {
                try {
                  onCopy && onCopy();
                } catch (e) {
                  // fixme: we should not ignore
                } finally {
                  setCopyState(true);
                }
              }}
            >
              {copyState ? "Copied" : "Copy Link"}
            </OptionItem>
          )}
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
