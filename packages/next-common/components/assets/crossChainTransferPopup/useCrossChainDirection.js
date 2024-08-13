import Chains from "next-common/utils/consts/chains";
import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

function Chain({ title, chain, name }) {
  return (
    <div className="flex flex-col grow">
      <PopupLabel text={title} />
      <div
        className={cn(
          "flex border border-neutral400 bg-neutral200 rounded-[8px]",
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

export default function useCrossChainDirection() {
  const component = (
    <div className="flex items-end gap-[12px]">
      <Chain title="Source Chain" chain={Chains.polkadot} name="Polkadot" />
      <div className="my-[3px] p-[8px] rounded-[8px] border border-neutral400 bg-neutral100">
        <SystemCrosschain
          width={24}
          height={24}
          className="[&_path]:fill-textPrimary"
        />
      </div>
      <Chain
        title="Destination Chain"
        chain={Chains.polkadotAssetHub}
        name="Asset Hub"
      />
    </div>
  );

  return {
    sourceChain: Chains.polkadot,
    destinationChain: Chains.polkadotAssetHub,
    component,
  };
}
