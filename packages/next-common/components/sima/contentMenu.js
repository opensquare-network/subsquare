import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useDetailType } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import PostLinkPopup from "next-common/components/linkPost/postLinkPopup";
import PostUnlinkPopup from "next-common/components/linkPost/postUnlinkPopup";
import ReportPopup from "next-common/components/reportPopup";
import copy from "copy-to-clipboard";
import { useComment } from "next-common/components/comment/context";
import {
  CopyMenuItem,
  LinkMenuItem,
  ReportMenuItem,
  UnlinkMenuItem,
} from "../contentMenu";

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
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  const onCopy = () => {
    copy(
      `${window.location.origin}${window.location.pathname}${window.location.search}#${comment.height}`,
    );
  };

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && (
        <OptionWrapper>
          <CopyMenuItem onCopy={onCopy} />
        </OptionWrapper>
      )}
    </Wrapper>
  );
}

export function PostContextMenu({ editable }) {
  const post = usePost();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const postType = useDetailType();
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);

  const isDiscussionPost = postType === detailPageCategory.POST;

  useOnClickOutside(ref, () => setShow(false));

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
          {editable && <>{!isDiscussionPost && linkOrUnlinkMenuItem}</>}
          <ReportMenuItem
            setShowReportPopup={setShowReportPopup}
            setShow={setShow}
          />
        </OptionWrapper>
      )}
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
      {showReportPopup && <ReportPopup setShow={setShowReportPopup} />}
    </Wrapper>
  );
}
