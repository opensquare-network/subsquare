import styled from "styled-components";
import Identity from "./Identity";
import { addressEllipsis } from "../utils";
import { normalizeAddress } from "next-common/utils/address";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { allWallets } from "next-common/utils/consts/connect";
import { find } from "lodash-es";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { useConnectors } from "wagmi";
import AddressAvatar from "./user/addressAvatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import AddressInfoLoading from "./addressInfo";
import FellowshipRank from "next-common/components/fellowship/rank";
import { useSingleMemberStatus } from "./fellowship/collective/hook/useFellowshipCoreMembersFilter";
import Tooltip from "next-common/components/tooltip";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";

function WalletIcon({ wallet: walletName }) {
  const wallet = find(allWallets, { extensionName: walletName });

  return (
    wallet?.logo && (
      <wallet.logo className="absolute right-0 bottom-0 w-4 h-4" />
    )
  );
}

function EvmWalletIcon({ id, wallet }) {
  const connectors = useConnectors();
  let connector = find(connectors, { id });
  // mixed chain talisman
  if (!connector) {
    connector = find(
      connectors,
      (c) => c.name.toLowerCase() === wallet?.toLowerCase?.(),
    );
  }

  return <WalletIcon wallet={connector?.name?.toLowerCase?.()} />;
}

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

export default function Account({
  account,
  showCollectiveStatus = false,
  showFullAddress = false,
}) {
  const { identity, hasIdentity, isLoading } = useIdentityInfo(
    account?.address,
  );
  const address = normalizeAddress(account?.address);
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const wallet = account?.meta?.source;

  const isEthereum = account?.type === ChainTypes.ETHEREUM;

  const addressHint = showFullAddress
    ? maybeEvmAddress
    : addressEllipsis(maybeEvmAddress);

  if (isLoading) {
    return <AddressInfoLoading address={address} />;
  }

  return (
    <>
      <AvatarWrapper>
        <AddressAvatar address={address} size={40} />
        {isEthereum ? (
          <EvmWalletIcon id={account?.meta?.connectorId} wallet={wallet} />
        ) : (
          <WalletIcon wallet={wallet} />
        )}
      </AvatarWrapper>
      <NameWrapper className="truncate">
        {/*TODO: use <IdentityOrAddr> after PR merged*/}
        {hasIdentity ? (
          <>
            <Identity identity={identity} />
            <div className="truncate">{account?.address}</div>
          </>
        ) : (
          <>
            <div className="text-textPrimary">
              {account?.name || addressHint}
            </div>
            <div className="truncate">{account?.address}</div>
          </>
        )}
      </NameWrapper>
      {showCollectiveStatus && <StatusAndRank address={account?.address} />}
    </>
  );
}

const useAccountCollective = (address) => {
  const { status } = useSingleMemberStatus({ address });
  const { fellowshipMembers } = usePageProps();

  const rank = useMemo(() => {
    return fellowshipMembers.find((member) => member.address === address);
  }, [address, fellowshipMembers]);

  return {
    ...status,
    ...rank,
  };
};

function StatusAndRank({ address }) {
  const chain = useChain();
  const isCollectives = isCollectivesChain(chain);
  const status = useAccountCollective(address);

  if (!isCollectives) {
    return null;
  }

  return status ? (
    <>
      <Tooltip content={status.isActive ? "Active" : "Inactive"}>
        <SignalIndicator
          className="w-[16px] h-[16px]"
          active={status.isActive}
        />
      </Tooltip>
      <FellowshipRank rank={status.rank || 0} />
    </>
  ) : null;
}
