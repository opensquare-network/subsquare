import React, { useRef, useState } from "react";
import styled from "styled-components";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import { useClickAway } from "react-use";
import { EditMenuItem, ReportMenu, PostDeleteMenu } from "./common";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import { usePost } from "next-common/context/post";
const Wrapper = styled.div`
  position: relative;
  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export default function DiscussionArticleMoreMenu({ editable, setIsEdit }) {
  const isAdmin = useIsAdmin();
  const ref = useRef();
  const [show, setShow] = useState(false);

  useClickAway(ref, () => setShow(false));
  const post = usePost();
  const canDelete = (editable || isAdmin) && !post.sima;

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {
        <OptionWrapper className={!show && "hidden"}>
          {editable && <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />}
          {canDelete && <PostDeleteMenu setShow={setShow} />}
          <ReportMenu setShow={setShow} />
        </OptionWrapper>
      }
    </Wrapper>
  );
}
