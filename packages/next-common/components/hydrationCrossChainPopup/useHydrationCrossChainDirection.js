import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import dynamic from "next/dynamic";
import { useState } from "react";
import { isAssetHubChain, isHydrationChain } from "next-common/utils/chain";
import { capitalize } from "lodash-es";
import { useChain } from "next-common/context/chain";
import Select from "next-common/components/select";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

function getChainName(chain) {
  if (isAssetHubChain(chain)) {
    return "Asset Hub";
  } else if (isHydrationChain(chain)) {
    return "Hydration";
  }
  return capitalize(chain);
}

// The two direction selects are always read-only — the direction only flips
// through the swap button in the middle — so this stays a pure display of a
// single chain.
function Chain({ title, chain, className = "" }) {
  return (
    <div className="flex flex-col grow basis-[calc(100%/2-33px)] shrink-0">
      <PopupLabel text={title} />
      <Select
        className={className}
        value={chain}
        disabled
        readOnly
        options={[
          {
            icon: <ChainIcon chain={chain} />,
            label: getChainName(chain),
            value: chain,
          },
        ]}
      />
    </div>
  );
}

export default function useHydrationCrossChainDirection() {
  const currChain = useChain();
  const assetHubChain = useAssetHubChain();

  // The direction is a single bit: the current chain is the source unless
  // reversed, in which case the two chains swap.
  const [isReversed, setIsReversed] = useState(false);
  const sourceChain = isReversed ? assetHubChain : currChain;
  const destinationChain = isReversed ? currChain : assetHubChain;

  const component = (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        chain={sourceChain}
        className="!text-textPrimary"
      />
      <div
        className="cursor-pointer p-[8px] rounded-[8px] border border-neutral400 bg-neutral100"
        onClick={() => setIsReversed((v) => !v)}
      >
        <SystemCrosschain
          width={24}
          height={24}
          className="[&_path]:fill-textPrimary"
        />
      </div>
      <Chain
        title="Destination Chain"
        chain={destinationChain}
        className="!text-textPrimary"
      />
    </div>
  );

  return {
    sourceChain,
    destinationChain,
    component,
  };
}
