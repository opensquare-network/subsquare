import React, { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import styled from "styled-components";
import { getDemocracyBeenDelegatedByAddress } from "../../../utils/democracy/getDemocracyBeenDelegatedByAddress";
import { getDemocracyBeenDelegatedListByAddress } from "../../../utils/democracy/getDemocracyBeenDelegatedListByAddress";
import BeenDelegatedInfo from "./beenDelegatedInfo";
import BeenDelegatedListButton from "./beenDelegatedListButton";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export default function DemocracyBeenDelegated() {
  const api = useApi();
  const realAddress = useRealAddress();
  const [delegations, setDelegations] = useState();
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);

  useEffect(() => {
    setDelegations();
    setBeenDelegatedList([]);

    if (!api || !realAddress) {
      return;
    }
    getDemocracyBeenDelegatedByAddress(api, realAddress).then((result) => {
      setDelegations(result);
    });
    getDemocracyBeenDelegatedListByAddress(api, realAddress).then((result) => {
      setBeenDelegatedList(result);
    });
  }, [api, realAddress]);

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
