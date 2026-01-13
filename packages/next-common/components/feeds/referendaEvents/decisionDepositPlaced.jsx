import AddressUser from "next-common/components/user/addressUser";
import Link from "next-common/components/link";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import LoadableFellowshipReferendumTitle from "next-common/components/feeds/loadableFellowshipReferendumTitle";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
const Label = tw.span`text-textSecondary`;

export default function FeedsDecisionDepositPlacedEvent({
  feed,
  showUserInfo = true,
}) {
  const { decimals, symbol } = useChainSettings();
  const { args: { who, referendumIndex, amount } = {} } = feed || {};

  return (
    <>
      <span className="text-textPrimary">
        {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      </span>
      <Label>Deposit</Label>
      <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
      <Label>for referendum</Label>
      <Tooltip
        content={
          <LoadableFellowshipReferendumTitle
            referendumIndex={referendumIndex}
          />
        }
      >
        <Link
          className="truncate cursor-pointer hover:underline"
          href={`/fellowship/referenda/${referendumIndex}`}
        >
          #{referendumIndex}
        </Link>
      </Tooltip>
    </>
  );
}
