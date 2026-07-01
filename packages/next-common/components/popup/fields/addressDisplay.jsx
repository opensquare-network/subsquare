"use client";

import AddressAvatar from "next-common/components/user/addressAvatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { normalizeAddress } from "next-common/utils/address";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { addressEllipsis } from "next-common/utils";
import Identity from "next-common/components/Identity";
import AddressInfoLoading from "next-common/components/addressInfo";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import styled from "styled-components";

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const NameWrapper = styled.div`
  color: var(--textPrimary);
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: var(--textTertiary);
  }
`;

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  gap: 16px;
`;

export default function AddressDisplay({ address }) {
  const { identity, hasIdentity, isLoading } = useIdentityInfo(address);
  const normalized = normalizeAddress(address);
  const displayAddress = tryConvertToEvmAddress(normalized);
  const addressHint = addressEllipsis(displayAddress);

  if (isLoading) {
    return (
      <Wrapper>
        <AddressInfoLoading address={normalized} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex items-center gap-3">
        <AvatarWrapper>
          <AddressAvatar address={normalized} size={40} />
        </AvatarWrapper>
        <NameWrapper className="truncate">
          {hasIdentity ? (
            <>
              <Identity identity={identity} />
              <div className="truncate">{normalized}</div>
            </>
          ) : (
            <>
              <div className="text-textPrimary">{addressHint}</div>
              <div className="truncate">{normalized}</div>
            </>
          )}
        </NameWrapper>
      </div>
    </Wrapper>
  );
}
