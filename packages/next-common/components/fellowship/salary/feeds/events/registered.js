import AddressUser from "next-common/components/user/addressUser";
import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Link from "next/link";

export default function FellowshipRegisteredFeed({ who, amount, index }) {
  const { symbol, decimals } = useSalaryAsset();

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
        <FellowshipFeedEventLabel>registered</FellowshipFeedEventLabel> in{" "}
        <Link
          href={`/fellowship/salary/cycles/${index}`}
          className="text-textPrimary hover:underline"
        >
          Cycle #{index}
        </Link>{" "}
        with salary{" "}
        <FellowshipFeedEventLabel>
          <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
        </FellowshipFeedEventLabel>
      </span>
    </>
  );
}
