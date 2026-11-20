import { ProjectIconVaraLight } from "@osn/icons/subsquare";
import { useChain } from "next-common/context/chain";
import {
  getVaraExplorerAccountLink,
  getVaraExplorerLink,
} from "next-common/utils/varaExplorer";
import IconLink from "./iconLink";

export function VaraExplorerAccountLink({ address }) {
  const chain = useChain();
  const url = getVaraExplorerAccountLink(chain, address);
  if (!url) {
    return null;
  }

  return (
    <IconLink href={url} icon={<ProjectIconVaraLight className="w-5 h-5" />} />
  );
}

export default function VaraExplorerLink({ indexer = {}, children }) {
  const chain = useChain();
  const url = getVaraExplorerLink(chain, indexer);
  if (!url) {
    return null;
  }

  if (children) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return <IconLink href={url} icon={<ProjectIconVaraLight />} />;
}
