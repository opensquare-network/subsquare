import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function RelayChainTreasury() {
  // TODO: address, totalBalance
  const address = "";
  const totalBalance = 123;
  const { decimals } = useChainSettings();

  return (
    <SummaryItem title="Relay Chain Treasury">
      {/* TODO: loading */}
      <LoadableContent isLoading={false}>
        <div>
          <ValueDisplay
            key="value"
            value={toPrecision(totalBalance, decimals)}
            symbol={""}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
