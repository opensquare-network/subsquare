import React from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import styled from "styled-components";
import BeenDelegatedInfo from "./beenDelegatedInfo";
import BeenDelegatedListButton from "./beenDelegatedListButton";
import useBeenDelegated from "next-common/hooks/useBeenDelegated";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export default function DemocracyBeenDelegated() {
  const realAddress = useRealAddress();
  const { delegations, beenDelegatedList } = useBeenDelegated(realAddress);

  if (!delegations || beenDelegatedList?.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <BeenDelegatedInfo
        delegations={delegations}
        addressesCount={beenDelegatedList?.length}
      />
      <BeenDelegatedListButton
        delegations={delegations}
        beenDelegatedList={beenDelegatedList}
      />
    </Wrapper>
  );
}
