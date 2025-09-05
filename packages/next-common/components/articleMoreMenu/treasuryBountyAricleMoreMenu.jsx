import React, { useRef, useState } from "react";
import styled from "styled-components";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import { useClickAway } from "react-use";
import {
  EditMenuItem,
  ReportMenu,
  AppendBountyMenu,
  LinkOrUnlinkMenu,
} from "./common";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
const Wrapper = styled.div`
  position: relative;
  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export default function TreasuryBountyAricleMoreMenu({
  editable,
  isAuthor,
  setIsEdit,
}) {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const { appendants } = useBountyAppendantsContext();

  useClickAway(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {
        <OptionWrapper className={!show && "hidden"}>
          {editable && (
            <EditMenuItem
              onClick={() => {
                setIsEdit(true);
                setShow(false);
              }}
            />
          )}
          <AppendBountyMenu setShow={setShow} />
          {editable && isAuthor && !appendants?.length && (
            <LinkOrUnlinkMenu setShow={setShow} />
          )}
          <ReportMenu setShow={setShow} />
        </OptionWrapper>
      }
    </Wrapper>
  );
}
