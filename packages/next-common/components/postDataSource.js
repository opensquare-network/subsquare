import { usePost } from "../context/post";
import { useChain, useChainSettings } from "../context/chain";
import {
  PolkassemblyChains,
  getPolkassemblyLink,
} from "next-common/utils/polkassembly";
import { useDetailType } from "../context/page";
import ExternalLink from "./externalLink";
import { getSubscanLink } from "next-common/utils/subscan";
import { LinkPolkassembly, LinkSubscan } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function PostDataSource() {
  const post = usePost();
  const type = useDetailType();
  const chain = useChain();
  const chainSettings = useChainSettings();

  const sources = [
    {
      label: <LinkPolkassembly />,
      when: PolkassemblyChains.includes(chain),
      link: getPolkassemblyLink(type, post),
    },
    {
      label: <LinkSubscan />,
      when: chainSettings.integrations?.subscan,
      link: getSubscanLink(chain, type, post),
    },
  ].filter((source) => source.when && source.link);

  return (
    !!sources.length && (
      <>
        <div className="flex items-center h-5 mx-4">
          <div className="h-4 w-0 border-r border-neutral400" />
        </div>
        <div className="flex items-center space-x-3">
          {sources.map((source) => (
            <ExternalLink
              key={source.link}
              href={source.link}
              externalIcon={false}
              className={cn(
                "[&_svg]:w-5 [&_svg]:h-5",
                "[&_svg_path]:fill-textTertiary [&_svg_path]:hover:fill-textSecondary",
              )}
            >
              {source.label}
            </ExternalLink>
          ))}
        </div>
      </>
    )
  );
}
