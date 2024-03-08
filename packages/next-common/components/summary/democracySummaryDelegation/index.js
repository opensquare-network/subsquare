import React from "react";
import styled from "styled-components";
import DemocracySummaryDelegationInfo from "./democracySummaryDelegationInfo";
import useRealAddress from "../../../utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import RemoveDelegation from "./removeDelegation";
import NewDelegation from "./newDelegation";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export default function DemocracySummaryDelegation() {
  const realAddress = useRealAddress();
  const { delegating } = useSubDemocracyDelegating(realAddress);
  const { hideActionButtons } = useChainSettings();

  return (
    <Wrapper>
      <DemocracySummaryDelegationInfo delegating={delegating} />
      {!hideActionButtons &&
        (delegating ? <RemoveDelegation /> : <NewDelegation />)}
    </Wrapper>
  );
}
