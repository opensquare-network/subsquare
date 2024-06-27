import React, { useRef, useState } from "react";
import styled from "styled-components";
import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside";
import {
  OptionItem,
  OptionWrapper,
} from "next-common/components/internalDropdown/styled";
import { InfoPlus, SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "next-common/components/comment/context";
import { CopyMenuItem, EditMenuItem } from "../contentMenu";
import { usePost } from "next-common/context/post";

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

  useOnClickOutside(ref, () => setShow(false));

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

export function PostContextMenu({ editable, setIsAppend, setIsEdit }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const post = usePost();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && (
        <OptionWrapper>
          {editable && (
            <>
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
  );
}
