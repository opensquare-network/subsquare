import AddressUser from "next-common/components/user/addressUser";
import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function FellowshipRegisteredFeed({ who, amount }) {
  const { symbol, decimals } = useSalaryAsset();

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        <FellowshipFeedEventLabel>registered</FellowshipFeedEventLabel>
        &nbsp;with salary&nbsp;
        <FellowshipFeedEventLabel>
          <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
        </FellowshipFeedEventLabel>
      </span>
    </>
  );
}
