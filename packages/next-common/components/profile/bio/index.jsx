import styled from "styled-components";
import { isPolkadotAddress } from "../../../utils/viewfuncs";
import Flex from "../../styled/flex";
import AccountLinks from "../../links/accountLinks";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { useChain, useIsKintsugi } from "next-common/context/chain";
import Copyable from "../../copyable";
import AssetInfo, {
  KintAssetInfo,
} from "next-common/components/profile/bio/assetInfo";
import Chains from "next-common/utils/consts/chains";
import AddressUser from "../../user/addressUser";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { AvatarDisplay } from "../../user/avatarDisplay";
import { useChainSettings } from "next-common/context/chain";
import OpenGovBio from "../OpenGovBio";
import DemocracyBio from "../democracyBio";
import { addressEllipsis, cn } from "next-common/utils";
import RightPanelContainer from "next-common/components/profile/bio/rightPanelContainer";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import UserAccountProvider from "next-common/context/user/account";
import AccountInfoPanel from "next-common/components/profile/bio/accountInfoPanel";

const Username = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
`;

const AddressWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-basis: 100%;
  flex-wrap: wrap;
`;

const Tertiary = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--textTertiary);
`;

export const DisplayUserAvatar = ({ address, user, size = 48 }) => (
  <AvatarDisplay
    avatarCid={user?.avatarCid}
    address={address}
    emailMd5={user?.emailMd5}
    size={size}
  />
);

export const DisplayUser = ({ id, className = "" }) => {
  if (isPolkadotAddress(id) || isEthereumAddress(id)) {
    return (
      <AddressUser
        add={id}
        showAvatar={false}
        className={cn("text16Bold text-textPrimary", className)}
        identityIconClassName="w-4 h-4"
      />
    );
  }

  return <Username>{id}</Username>;
};

export const DisplayUserAddress = ({
  address,
  className = "",
  showLinks = true,
  ellipsisAddress = false,
  extra = null,
  accountLinksClassName = "",
}) => {
  if (!address) {
    return null;
  }
  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const displayAddress = ellipsisAddress ? addressEllipsis(address) : address;
  return (
    <AddressWrapper className={className}>
      <Copyable copyText={maybeEvmAddress}>
        <Tertiary>{displayAddress}</Tertiary>
      </Copyable>
      <div className={cn("inline-flex items-center", accountLinksClassName)}>
        {showLinks && <AccountLinks address={maybeEvmAddress} />}
        {extra}
      </div>
    </AddressWrapper>
  );
};

function NormalBio() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  return (
    <div
      className={cn(
        "grid gap-[16px] grid-cols-1",
        isMobile ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      <AccountInfoPanel address={address} id={id} user={user} />

      {isKintsugi ? (
        <KintAssetInfo address={address} />
      ) : (
        <RightPanelContainer className="grid-cols-1">
          <UserAccountProvider address={address}>
            <AssetInfo address={address} />
          </UserAccountProvider>
        </RightPanelContainer>
      )}
    </div>
  );
}

export default function Bio() {
  const { modules } = useChainSettings();
  const hasDemocracy = modules?.democracy && !modules?.democracy?.archived;
  const isKintsugi = useIsKintsugi();

  if (isKintsugi) {
    return <NormalBio />;
  } else if (modules?.referenda) {
    return <OpenGovBio />;
  } else if (hasDemocracy) {
    return <DemocracyBio />;
  }

  return <NormalBio />;
}
