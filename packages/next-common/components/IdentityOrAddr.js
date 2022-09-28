import React, { useEffect, useState } from "react";
import { nodes } from "../utils/constants";
import { fetchIdentity } from "../services/identity";
import { encodeAddressToChain } from "../services/address";
import Identity from "./Identity";
import styled from "styled-components";
import { addressEllipsis } from "../utils";
import { getInitMode } from "../store/reducers/settingSlice";
import dark from "./styled/theme/dark";
import light from "./styled/theme/light";
import { isAddress } from "../utils/viewfuncs";

const NameWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.secondarySapphire500};
  background: ${(props) => props.theme.secondarySapphire100};
`;

const MentionBox = styled.a`
  display: flex;
  padding: 0 8px;
  gap: 2px;
  line-height: 20px;
  border-radius: 4px;
`;

function IdentityOrAddr({ address, network }) {
  const [identity, setIdentity] = useState(null);
  const mode = getInitMode();
  const theme = mode === "dark" ? dark : light;

  useEffect(() => {
    setIdentity(null);
    if (isAddress(address)) {
      const identity = nodes.find((n) => n.value === network)?.identity;
      if (!identity) return;

      fetchIdentity(identity, encodeAddressToChain(address, identity)).then(
        (identity) => setIdentity(identity)
      );
    }
  }, [address, network]);

  if (!isAddress(address)) {
    return (
      <MentionBox href={`/user/${address}`}>
        <span>@</span>
        {address}
      </MentionBox>
    );
  }

  return (
    <NameWrapper theme={theme}>
      {identity && identity?.info?.status !== "NO_ID" ? (
        <MentionBox href={`/user/${address}`}>
          <span>@</span>
          <Identity identity={identity} />
        </MentionBox>
      ) : (
        <>
          <MentionBox href={`/user/${address}`}>
            <span>@</span>
            {addressEllipsis(encodeAddressToChain(address, network))}
          </MentionBox>
        </>
      )}
    </NameWrapper>
  );
}

export default IdentityOrAddr;
