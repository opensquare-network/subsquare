import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useDetailType } from "../context/page";
import { usePost } from "../context/post";
import { detailPageCategory } from "../utils/consts/business/category";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { OptionItem, OptionWrapper } from "./internalDropdown/styled";

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
  setShowUnlinkPopup,
  copy = false,
  onCopy,
  alwaysShow,
}) {
  const post = usePost();
  const [show, setShow] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const ref = useRef();
  const postType = useDetailType();
  const hasLinkMenu =
    postType !== detailPageCategory.POST &&
    setShowLinkPopup &&
    setShowUnlinkPopup;

  useEffect(() => {
    if (copyState) {
      setTimeout(() => {
        setCopyState(false);
      }, 3000);
    }
  }, [copyState]);

  useOnClickOutside(ref, () => setShow(false));

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
      <OptionItem
        onClick={() => {
          setShowUnlinkPopup(true);
          setShow(false);
        }}
      >
        Unlink
      </OptionItem>
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
              {hasLinkMenu && linkOrUnlinkMenuItem}
              <OptionItem
                onClick={() => {
                  setIsEdit(true);
                  setShow(false);
                }}
              >
                Edit
              </OptionItem>
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
