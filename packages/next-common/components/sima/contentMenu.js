import React, { useRef, useState } from "react";
import styled from "styled-components";
import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import copy from "copy-to-clipboard";
import { useComment } from "next-common/components/comment/context";
import { CopyMenuItem } from "../contentMenu";

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
