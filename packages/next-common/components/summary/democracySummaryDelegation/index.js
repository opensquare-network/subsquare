import React from "react";
import styled from "styled-components";
import DemocracySummaryDelegationInfo from "./democracySummaryDelegationInfo";
import useDemocracyDelegating from "../../../utils/hooks/referenda/useDemocracyDelegating";
import useRealAddress from "../../../utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import RemoveDelegation from "./removeDelegation";
import NewDelegation from "./newDelegation";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export default function DemocracySummaryDelegation() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { delegating, refresh } = useDemocracyDelegating(api, realAddress);
  const { hideActionButtons } = useChainSettings();

  return (
    <Wrapper>
      <DemocracySummaryDelegationInfo delegating={delegating} />
      {!hideActionButtons &&
        (delegating ? (
          <RemoveDelegation refresh={refresh} />
        ) : (
          <NewDelegation refresh={refresh} />
        ))}
    </Wrapper>
  );
}
