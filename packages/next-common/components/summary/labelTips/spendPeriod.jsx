import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";
import { useChainSettings } from "next-common/context/chain";
import { hasTreasuryApprovals } from "next-common/utils/treasury/approvals";

export default function SpendPeriodLabelTip() {
  const hasApprovals = hasTreasuryApprovals(useChainSettings());

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
            {hasApprovals
              ? "Approved proposals will be awarded at the end of each spend period."
              : "Approved bounties are funded at the end of each spend period."}
            {wikiLink}
          </>
        }
      ></Tooltip>
    </span>
  );
}
