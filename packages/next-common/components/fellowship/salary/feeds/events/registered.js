import AddressUser from "next-common/components/user/addressUser";
import { FellowshipFeedEventLabel } from "next-common/components/fellowship/feeds/label";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Link from "next/link";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function FellowshipRegisteredFeed({ who, amount, index }) {
  const { symbol, decimals } = getSalaryAsset();
  const { section } = useCollectivesContext();

  return (
    <>
      <AddressUser key={who} add={who} noTooltip />
      <span>
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
      </span>
    </>
  );
}
