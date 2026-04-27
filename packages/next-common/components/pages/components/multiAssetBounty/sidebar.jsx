import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import { InfoDocs, InfoUser, SystemCoins } from "@osn/icons/subsquare";
import AddressUser from "next-common/components/user/addressUser";
import Copyable from "next-common/components/copyable";
import Tooltip from "next-common/components/tooltip";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

function CardDetailTitle({ title }) {
  return (
    <TitleContainer className="mb-4 !px-0">
      <span>{title}</span>
    </TitleContainer>
  );
}

function CardDetailRow({ icon, title, value }) {
  return (
    <BorderedRow>
      <Header>
        <div className="[&_svg]:w-[20px] [&_svg]:h-[20px] [&_svg]:text-textTertiary">
          {icon}
        </div>
        {title}
      </Header>
      <span className="text14Medium">{value}</span>
    </BorderedRow>
  );
}

function MultiAssetBountySidebarBalance() {
  const { address, value: bountyValue, assetKind } = useOnchainData();
  const { childBounties } = usePageProps();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainDecimals,
    chainSymbol,
  );

  if (!address) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <CardDetailTitle title="Balance" />
      {bountyValue != null && (
        <CardDetailRow
          icon={<SystemCoins />}
          title="Balance"
          value={
            <ValueDisplay
              value={toPrecision(bountyValue, decimals)}
              symbol={symbol}
            />
          }
        />
      )}
      <CardDetailRow
        icon={<InfoDocs />}
        title="Child Bounties"
        value={<Value>{childBounties?.total || 0}</Value>}
      />
      <CardDetailRow
        icon={<InfoUser />}
        title="Address"
        value={
          <Value>
            <Copyable copyText={address} className="inline-flex items-center">
              <Tooltip content={address}>
                <AddressUser add={address} showBountyIdentity={false} />
              </Tooltip>
            </Copyable>
          </Value>
        }
      />
    </SecondaryCardDetail>
  );
}

function MultiAssetBountySidebar() {
  const { address } = useOnchainData();

  if (!address) {
    return null;
  }

  return (
    <RightBarWrapper>
      <MultiAssetBountySidebarBalance />
      <BountySidebarCurator />
    </RightBarWrapper>
  );
}

export default MultiAssetBountySidebar;
