import AddressUser from "next-common/components/user/addressUser";
import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";

export default function FellowshipSalaryPaidFeed({ feed = {} }) {
  const { args: { who, amount } = {} } = feed || {};
  const { symbol, decimals } = useSalaryAsset();

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        &nbsp;was&nbsp;
        <FellowshipFeedEventLabel>Paid</FellowshipFeedEventLabel>
        &nbsp;
        <FellowshipFeedEventLabel>
          <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
        </FellowshipFeedEventLabel>
      </span>
    </>
  );
}
