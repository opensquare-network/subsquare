import AddressUser from "next-common/components/user/addressUser";
import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Link from "next-common/components/link";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { useSalaryAsset } from "next-common/hooks/fellowship/salary/useSalaryAsset";

export function FellowshipRegisteredFeedContent({
  amount,
  index,
  blockHeight,
}) {
  const section = useCollectivesSection();
  const { symbol, decimals } = useSalaryAsset(blockHeight);

  return (
    <>
      <FellowshipFeedEventLabel>registered</FellowshipFeedEventLabel> in{" "}
      <Link
        href={`/${section}/salary/cycles/${index}`}
        className="text-textPrimary hover:underline"
      >
        cycle #{index}
      </Link>{" "}
      with salary{" "}
      <FellowshipFeedEventLabel>
        <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
      </FellowshipFeedEventLabel>
    </>
  );
}

export default function FellowshipRegisteredFeed({
  who,
  amount,
  index,
  showUserInfo = true,
  blockHeight,
}) {
  return (
    <>
      {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      <span>
        <FellowshipRegisteredFeedContent
          amount={amount}
          index={index}
          blockHeight={blockHeight}
        />
      </span>
    </>
  );
}
