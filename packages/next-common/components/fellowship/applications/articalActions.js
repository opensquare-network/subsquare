import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";
import { CommonArticleActions } from "next-common/components/actions/articleActions";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { SystemMore } from "@osn/icons/subsquare";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import styled from "styled-components";
import {
  EditMenuItem,
  ReportMenuItem,
} from "next-common/components/contentMenu";
import ReportPopup from "next-common/components/reportPopup";

const Wrapper = styled.div`
  position: relative;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

function FellowshipApplicationContextMenu({ isAuthor, setIsEdit }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const editable = isAuthor;

  useClickAway(ref, () => setShow(false));

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
              {isAuthor && (
                <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />
              )}
            </>
          )}
          <ReportMenuItem
            setShowReportPopup={setShowReportPopup}
            setShow={setShow}
          />
        </OptionWrapper>
      )}
      {showReportPopup && <ReportPopup setShow={setShowReportPopup} />}
    </Wrapper>
  );
}

export default function ArticleActions({ setIsEdit, extraActions }) {
  const isAuthor = useIsPostAuthor();

  return (
    <CommonArticleActions
      extraActions={extraActions}
      contextMenu={
        <FellowshipApplicationContextMenu
          isAuthor={isAuthor}
          setIsEdit={setIsEdit}
        />
      }
    />
  );
}
