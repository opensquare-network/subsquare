import { isNil } from "lodash-es";
import NetworkIcon from "next-common/components/networkIcon";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { toPrecision } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { RequestWrapper } from ".";

export default function AllSpendsRequest() {
  const onchain = useOnchainData();

  if (
    !onchain?.isTreasury &&
    !onchain?.isStableTreasury &&
    isNil(onchain?.value) &&
    !onchain?.allSpends
  ) {
    return null;
  }

  return (
    <RequestWrapper>
      <div className="flex flex-col">
        {onchain?.allSpends?.map?.((spend, idx) => (
          <Spend key={idx} assetKind={spend.assetKind} amount={spend.amount} />
        ))}
      </div>
    </RequestWrapper>
  );
}

function Spend({ assetKind, amount }) {
  const currentChain = useChain();
  let { chain, symbol, type } = assetKind;

  if (type === "assets") {
    chain = Chains.polkadotAssetHub;
  } else if (type === "native") {
    chain = currentChain;
  }
  const { decimals } = getChainSettings(chain);

  return (
    <div className="flex justify-end items-center gap-x-2">
      <NetworkIcon chain={chain} className="w-3 h-3" />

      <ValueDisplay
        className="text14Medium"
        value={toPrecision(amount, decimals)}
        symbol={symbol}
      />
    </div>
  );
}
