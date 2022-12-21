import {
  getGov2BeenDelegatedByAddress,
  getGov2BeenDelegatedListByAddress,
} from "next-common/utils/gov2/gov2ReferendumVote";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BeenDelegatedInfo from "next-common/components/summary/democracyBeenDelegated/beenDelegatedInfo";
import BeenDelegatedListButton from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListButton";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function BeenDelegated({ trackId }) {
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
    getGov2BeenDelegatedByAddress(api, trackId, realAddress).then((result) => {
      setDelegations(result);
    });
    getGov2BeenDelegatedListByAddress(api, trackId, realAddress).then(
      (result) => {
        setBeenDelegatedList(result);
      }
    );
  }, [api, trackId, realAddress]);

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
