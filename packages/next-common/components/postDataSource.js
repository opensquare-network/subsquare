import Chains from "../utils/consts/chains";
import { usePost } from "../context/post";
import { useChain } from "../context/chain";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "../context/page";
import { GreyPanel } from "./styled/containers/greyPanel";
import ExternalLink from "./externalLink";

export default function PostDataSource() {
  const post = usePost();
  const type = useDetailType();
  const chain = useChain();

  if (
    ![
      Chains.kusama,
      Chains.polkadot,
      Chains.moonriver,
      Chains.collectives,
    ].includes(chain)
  ) {
    return null;
  }

  const paLink = getPolkassemblyLink(type, post);
  if (!paLink) {
    return null;
  }

  return (
    <GreyPanel className="!rounded-lg px-4 py-2.5 mt-4 gap-2">
      <ExternalLink className="text14Medium text-sapphire500" href={paLink}>
        Polkassembly <span className="text-textSecondary">↗</span>
      </ExternalLink>
    </GreyPanel>
  );
}
