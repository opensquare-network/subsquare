import { useChain } from "next-common/context/chain";
import IconLink from "./iconLink";
import { LinkNeckwork } from "@osn/icons/subsquare";
import { getNeckworkDomain } from "next-common/utils/neckwork";

export default function NeckworkAccountLink({ address }) {
  const chain = useChain();
  const domain = getNeckworkDomain(chain);
  if (!domain) {
    return null;
  }

  return (
    <IconLink
      href={`https://${domain}.neckwork.net/account/${address}`}
      icon={<LinkNeckwork className="w-5 h-5" />}
    />
  );
}
