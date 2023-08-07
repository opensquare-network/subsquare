import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
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
} from "@osn/icons/subsquare";

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
  report,
  setIsEdit,
  setShowLinkPopup,
  setShowUnlinkPopup,
  setShowReportPopup,
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
      <div className="mr-2">
        <SystemLink />
      </div>
      <span>Link</span>
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
        <div className="mr-2">
          <SystemLink />
        </div>
        <span>Unlink</span>
      </OptionItem>
    );
  }

  const editMenuItem = (
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

  const copyMenuItem = (
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
      <div className="mr-2">
        {copyState ? <SystemCopied /> : <SystemCopy />}
      </div>
      <span>{copyState ? "Copied" : "Copy Link"}</span>
    </OptionItem>
  );

  const reportMenuItem = (
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

  return (
    <Wrapper className="edit" active={show || alwaysShow} ref={ref}>
      <SystemMore
        className="w-4 h-4 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => {
          setShow(!show);
        }}
      />
      {show && (
        <OptionWrapper>
          {edit && (
            <>
              {hasLinkMenu && linkOrUnlinkMenuItem}
              {editMenuItem}
            </>
          )}
          {copy && copyMenuItem}
          {report && reportMenuItem}
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
