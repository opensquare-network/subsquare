import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import SymbolValue from "components/gov2/sidebar/tally/values/symbolValue";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import { InfoDocs, InfoUser, SystemCoins } from "@osn/icons/subsquare";
import { addressEllipsis } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import Copyable from "next-common/components/copyable";
import LoadableContent from "next-common/components/common/loadableContent";

export function CardDetailTitle({ title }) {
  return (
    <TitleContainer className="mb-4 !px-0">
      <span>{title}</span>
    </TitleContainer>
  );
}

export function CardDetailRow({ isLoading = false, icon, title, value }) {
  return (
    <BorderedRow>
      <Header>
        <div className="[&_svg]:w-[20px] [&_svg]:h-[20px] [&_svg]:text-textTertiary">
          {icon}
        </div>
        {title}
      </Header>
      <LoadableContent isLoading={isLoading}>
        <span className="text14Medium">{value}</span>
      </LoadableContent>
    </BorderedRow>
  );
}

export function CopyableAddress({ address }) {
  return (
    <Copyable copyText={address} className="inline-flex items-center">
      <Tooltip content={address}>{addressEllipsis(address)}</Tooltip>
    </Copyable>
  );
}

function BountySidebarBalance() {
  const { address } = useOnchainData();
  const { balance, isLoading } = useSubAddressBalance(address);
  const { childBounties } = usePageProps();

  if (!address) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <CardDetailTitle title="Balance" />
      <CardDetailRow
        icon={<SystemCoins />}
        title="Balance"
        value={<SymbolValue value={balance} />}
        isLoading={isLoading}
      />
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
            <CopyableAddress address={address} />
          </Value>
        }
      />
    </SecondaryCardDetail>
  );
}

export default BountySidebarBalance;
