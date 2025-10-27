import Tooltip from "next-common/components/tooltip";
import Link from "next/link";

export function ToBeAwardedLabel() {
  return (
    <>
      To be awarded
      <Tooltip content="Amount of approved proposals pending payout."></Tooltip>
    </>
  );
}

export function NextBurnLabel() {
  const wikiLink = (
    <Link
      className="underline ml-1"
      href="https://wiki.polkadot.com/general/chain-state-values/#treasury-burn-factor"
      target="_blank"
      rel="noreferrer"
    >
      wiki↗
    </Link>
  );

  return (
    <>
      Next burn
      <Tooltip
        content={
          <>
            Unspent treasury funds scheduled to be burned at the end of the
            current cycle.{wikiLink}
          </>
        }
      ></Tooltip>
    </>
  );
}

export function SpendPeriodLabel() {
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
    <>
      Spend period
      <Tooltip
        content={<>Duration of one treasury funding cycle.{wikiLink}</>}
      ></Tooltip>
    </>
  );
}
