import React from "react";
import AllBeenDelegatedPopupTabList from "./tab";
import styled from "styled-components";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";

const StyledPopup = styled(BaseVotesPopup)`
  width: 610px;
`;

export default function AllBeenDelegatedPopup({
  beenDelegatedList,
  setShow = () => {},
}) {
  return (
    <StyledPopup title="Been Delegated" onClose={() => setShow(false)}>
      <AllBeenDelegatedPopupTabList beenDelegatedList={beenDelegatedList} />
    </StyledPopup>
  );
}
