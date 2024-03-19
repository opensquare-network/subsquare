import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";

export default function ReferendaDelegationLink() {
  const {
    modules: { referenda: hasReferenda, democracy: hasDemocracy },
  } = useChainSettings();
  let delegationLink = "/delegation";
  if (hasReferenda && hasDemocracy) {
    delegationLink = delegationLink + "?type=Referenda";
  }

  return (
    <Link className="text14Medium text-theme500" href={delegationLink}>
      Manage Delegation
    </Link>
  );
}
