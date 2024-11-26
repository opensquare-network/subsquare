import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { InfoPlus, SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "next-common/components/comment/context";
import {
  CopyMenuItem,
  EditMenuItem,
  LinkMenuItem,
  UnlinkMenuItem,
} from "next-common/components/contentMenu";
import { usePost } from "next-common/context/post";
import PostLinkPopup from "next-common/components/linkPost/postLinkPopup";
import PostUnlinkPopup from "next-common/components/linkPost/postUnlinkPopup";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

const Wrapper = styled.div`
  position: relative;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export function AppendMenuItem({ setIsAppend, setShow }) {
  return (
    <OptionItem
      onClick={() => {
        setIsAppend(true);
        setShow(false);
      }}
    >
      <div className="mr-2">
        <InfoPlus />
      </div>
      <span>Append</span>
    </OptionItem>
  );
}

export function CommentContextMenu() {
  const comment = useComment();
  const [show, setShow] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  const onCopy = () => {
    copy(
      `${window.location.origin}${window.location.pathname}${window.location.search}#${comment.cid}`,
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

export function PostContextMenu({ isAuthor, canEdit, setIsAppend, setIsEdit }) {
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);

  const [show, setShow] = useState(false);
  const ref = useRef();
  const post = usePost();
  const type = useDetailType();
  const isSimaDiscussion = type === detailPageCategory.POST;

  useClickAway(ref, () => setShow(false));

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
    <>
      <Wrapper ref={ref}>
        <SystemMore
          className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
          onClick={() => setShow(!show)}
        />
        {show && (
          <OptionWrapper>
            {canEdit && (
              <>
                {isAuthor && !isSimaDiscussion && linkOrUnlinkMenuItem}
                {post.content ? (
                  <AppendMenuItem setIsAppend={setIsAppend} setShow={setShow} />
                ) : (
                  <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />
                )}
              </>
            )}
          </OptionWrapper>
        )}
      </Wrapper>
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
    </>
  );
}
