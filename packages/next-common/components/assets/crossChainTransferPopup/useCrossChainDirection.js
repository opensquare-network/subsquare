import Chains from "next-common/utils/consts/chains";
import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";
import { useState } from "react";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

function Chain({ title, chain, name }) {
  return (
    <div className="flex flex-col grow basis-[calc(100%/2-33px)]">
      <PopupLabel text={title} />
      <div
        className={cn(
          "flex border border-neutral400 bg-neutral200 rounded-[8px] overflow-hidden whitespace-nowrap",
          "p-[10px] items-center gap-[8px]",
          "text14Medium text-textPrimary",
        )}
      >
        <ChainIcon className="w-[24px] h-[24px]" chain={chain} />
        <span>{name}</span>
      </div>
    </div>
  );
}

function getChainName(chain) {
  if (chain === Chains.polkadot) {
    return "Polkadot";
  } else if (chain === Chains.polkadotAssetHub) {
    return "Asset Hub";
  }

  throw new Error("Unsupported chain");
}

export default function useCrossChainDirection() {
  const [sourceChain, setSourceChain] = useState(Chains.polkadot);
  const [destinationChain, setDestinationChain] = useState(
    Chains.polkadotAssetHub,
  );

  const component = (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        chain={sourceChain}
        name={getChainName(sourceChain)}
      />
      <div
        className="cursor-pointer my-[3px] p-[8px] rounded-[8px] border border-neutral400 bg-neutral100"
        onClick={() => {
          setSourceChain(destinationChain);
          setDestinationChain(sourceChain);
        }}
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
        name={getChainName(destinationChain)}
      />
    </div>
  );

  return {
    sourceChain,
    destinationChain,
    component,
  };
}
