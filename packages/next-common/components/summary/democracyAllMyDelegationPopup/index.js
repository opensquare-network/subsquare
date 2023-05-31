import React from "react";
import AllMyDelegationTabList from "./tab";
import styled from "styled-components";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";

const StyledPopup = styled(BaseVotesPopup)`
  width: 610px;
`;

export default function AllMyDelegationPopup({
  myDelegationList,
  setShow = () => {},
}) {
  return (
    <StyledPopup title="My Delegation" onClose={() => setShow(false)}>
      <AllMyDelegationTabList myDelegationList={myDelegationList} />
    </StyledPopup>
  );
}
