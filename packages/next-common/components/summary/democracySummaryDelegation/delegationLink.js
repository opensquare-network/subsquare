import React from "react";
import Link from "next/link";
import { useChainSettings } from "next-common/context/chain";

export default function DemocracyDelegationLink() {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracy = democracy && !democracy?.archived;

  let delegationLink = "/delegation";
  if (hasReferenda && hasDemocracy) {
    delegationLink = delegationLink + "?type=democracy";
  }

  return (
    <Link className="text14Medium text-theme500" href={delegationLink}>
      Delegate
    </Link>
  );
}
