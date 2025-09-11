import {
  getGov2BeenDelegatedByAddress,
  getGov2BeenDelegatedListByAddress,
} from "next-common/utils/gov2/gov2ReferendumVote";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BeenDelegatedInfo from "next-common/components/summary/democracyBeenDelegated/beenDelegatedInfo";
import BeenDelegatedListButton from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListButton";
import { useMountedState } from "react-use";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function BeenDelegated({ trackId }) {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const [delegations, setDelegations] = useState();
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);
  const isMounted = useMountedState();

  useEffect(() => {
    setDelegations();
    setBeenDelegatedList([]);

    if (!api || !realAddress || isNil(trackId)) {
      return;
    }
    getGov2BeenDelegatedByAddress(api, realAddress, trackId).then((result) => {
      if (isMounted()) {
        setDelegations(result);
      }
    });
    getGov2BeenDelegatedListByAddress(api, realAddress, trackId).then(
      (result) => {
        if (isMounted()) {
          setBeenDelegatedList(result);
        }
      },
    );
  }, [api, trackId, realAddress, isMounted]);

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
