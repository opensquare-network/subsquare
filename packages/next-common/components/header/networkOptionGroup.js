import ChainIcon from "./chainIcon";
import { nodes } from "../../utils/constants";
import { getRelayChain, isAssetHubChain } from "next-common/utils/chain";
import { find } from "lodash-es";
import Link from "next/link";
import { cn } from "next-common/utils";
import { useChain } from "next-common/context/chain";

export default function NetworkOptionGroup({ groupName, activeNode, setShow }) {
  let chain = useChain();
  const isAssetHub = isAssetHubChain(chain);
  if (isAssetHub) {
    chain = getRelayChain(chain);
  }

  const filteredNodes = nodes.filter(({ group }) => group === groupName);

  return (
    <div>
      <div className="p-3 text12Bold uppercase text-textTertiary tracking-[0.16em]">
        {groupName}
      </div>
      <div className="grid grid-cols-3 max-sm:grid-cols-1">
        {filteredNodes.map((item, index) => {
          const isActive = activeNode.value === item.value;

          let nodeChain = item.value;
          const isAssetHubNode = isAssetHubChain(nodeChain);
          if (isAssetHubNode) {
            nodeChain = getRelayChain(nodeChain);
          }

          const node = find(filteredNodes, { value: nodeChain }) || item;

          let url;
          if (!isActive) {
            if (chain === nodeChain) {
              url = "/";
            } else {
              url = `https://${node.domain || node.value}.subsquare.io`;
            }
          }

          if (url && isAssetHubNode) {
            url = `${url}/assethub`;
          }

          return (
            <Option
              key={index}
              isActive={isActive}
              onClick={() => {
                setShow(false);
              }}
              href={url}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
}

function Option({ onClick, item, isActive, href }) {
  let content = (
    <>
      <ChainIcon chain={item.value} />
      <span>{item.name}</span>
    </>
  );

  const className = cn(
    "flex items-center gap-x-2",
    "px-3 h-9",
    "text14Medium text-textPrimary",
    "rounded",
    "hover:bg-neutral200",
    isActive && "bg-neutral200",
  );

  if (isActive) {
    content = (
      <span className={className} onClick={onClick} role="button">
        {content}
      </span>
    );
  } else {
    content = (
      <Link className={className} onClick={onClick} href={href}>
        {content}
      </Link>
    );
  }

  return content;
}
