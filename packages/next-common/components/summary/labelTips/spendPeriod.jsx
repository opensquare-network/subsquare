import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";

export default function SpendPeriodLabelTip() {
  const wikiLink = (
    <Link
      className="underline ml-1"
      href="https://wiki.polkadot.com/general/glossary/#spend-period"
      target="_blank"
      rel="noreferrer"
    >
      wiki↗
    </Link>
  );
  return (
    <span className="flex items-center gap-x-1">
      Spend period
      <Tooltip
        content={
          <>
            Approved bounties are funded at the end of each spend period.
            {wikiLink}
          </>
        }
      ></Tooltip>
    </span>
  );
}
