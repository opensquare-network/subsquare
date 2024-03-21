import React from "react";
import styled from "styled-components";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VStack from "next-common/components/styled/vStack";
import AllMyDelegationPopupList from "next-common/components/summary/democracyAllMyDelegationPopup/list";
import { noop } from "lodash-es";
import AllDelegationsBar from "./allDelegationBar";

const StyledPopup = styled(BaseVotesPopup)`
  width: 610px;
`;

export default function AllMyDelegationPopup({ setShow = noop }) {
  return (
    <StyledPopup title="My Delegation" onClose={() => setShow(false)}>
      <VStack space={16}>
        <AllDelegationsBar />
        <AllMyDelegationPopupList />
      </VStack>
    </StyledPopup>
  );
}
