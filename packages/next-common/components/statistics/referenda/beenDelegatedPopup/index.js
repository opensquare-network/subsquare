import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationSummary from "./delegationSummary";
import DelegationTabList from "./delegationTabList";
import styled from "styled-components";
import { smcss } from "next-common/utils/responsive";
import { w_full, overflow_y_scroll } from "next-common/styles/tailwindcss";

const StyledPopup = styled(Popup)`
  width: 720px;
  max-height: 80vh;
  ${overflow_y_scroll};

  ${smcss(w_full)};
`;

export default function BeenDelegatedListPopup({
  delegatee,
  delegatorsCount,
  delegatedCapital,
  delegatedVotes,
  tracksCount,
  setShow,
}) {
  return (
    <StyledPopup wide title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary
        delegatee={delegatee}
        delegatorsCount={delegatorsCount}
        delegatedCapital={delegatedCapital}
        delegatedVotes={delegatedVotes}
        tracksCount={tracksCount}
      />
      <DelegationTabList delegatee={delegatee} />
    </StyledPopup>
  );
}
