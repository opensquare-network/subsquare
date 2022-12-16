import { getGov2BeenDelegatedListByAddress } from "next-common/utils/gov2/gov2ReferendumVote";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BeenDelegatedInfo from "./beenDelegatedInfo";
import BeenDelegatedListButton from "./beenDelegatedListButton";

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
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);
  useEffect(() => {
    if (!api) {
      return;
    }
    getGov2BeenDelegatedListByAddress(api, trackId, realAddress).then(
      (result) => {
        setBeenDelegatedList(result);
      }
    );
  }, [api, trackId, realAddress]);

  if (beenDelegatedList?.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <BeenDelegatedInfo beenDelegatedList={beenDelegatedList} />
      <BeenDelegatedListButton beenDelegatedList={beenDelegatedList} />
    </Wrapper>
  );
}
