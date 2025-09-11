import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";

export default function ReferendaDelegationLink() {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracy = democracy && !democracy?.archived;

  let delegationLink = "/delegation";
  if (hasReferenda && hasDemocracy) {
    delegationLink = delegationLink + "?type=referenda";
  }

  return (
    <Link className="text14Medium text-theme500" href={delegationLink}>
      Delegate
    </Link>
  );
}
