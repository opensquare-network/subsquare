import Chains from "../utils/consts/chains";
import { usePost } from "../context/post";
import { useChain, useChainSettings } from "../context/chain";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "../context/page";
import { GreyPanel } from "./styled/containers/greyPanel";
import ExternalLink from "./externalLink";
import { getSubscanLink } from "next-common/utils/subscan";

export default function PostDataSource() {
  const post = usePost();
  const type = useDetailType();
  const chain = useChain();
  const chainSettings = useChainSettings();

  const sources = [
    {
      label: "Polkassembly",
      when: [
        Chains.kusama,
        Chains.polkadot,
        Chains.moonriver,
        Chains.collectives,
      ].includes(chain),
      link: getPolkassemblyLink(type, post),
    },
    {
      label: "Subscan",
      when: chainSettings.hasSubscan,
      link: getSubscanLink(chain, type, post),
    },
  ].filter((source) => source.when && source.link);

  return (
    !!sources.length && (
      <GreyPanel className="!rounded-lg px-4 py-2.5 mt-4 space-x-4">
        {sources.map((source) => (
          <ExternalLink key={source.link} href={source.link}>
            {source.label}
          </ExternalLink>
        ))}
      </GreyPanel>
    )
  );
}
