import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";

function FeeRow({ title, fee, loading }) {
  return (
    <div className="flex w-full justify-between items-center gap-x-2">
      <span className="text14Bold text-textPrimary">{title}</span>
      <LoadableContent isLoading={loading} size={20}>
        {isNil(fee) ? (
          <span>-</span>
        ) : (
          <ValueDisplay
            value={toPrecision(fee.amount, fee.decimals, 4)}
            symbol={fee.symbol}
          />
        )}
      </LoadableContent>
    </div>
  );
}

// Compact fee summary for the Asset Hub <-> Hydration cross-chain popup, laid
// out like EstimatedGas (name + value, justify-between).
export default function CrossChainFeeSummary({
  sourceFee,
  destinationFee,
  isLoading,
}) {
  return (
    <GreyPanel className="flex-col gap-y-2 px-4 py-2.5 text14Medium">
      <FeeRow title="Source chain fee" fee={sourceFee} loading={isLoading} />
      <FeeRow
        title="Destination chain fee"
        fee={destinationFee}
        loading={isLoading}
      />
    </GreyPanel>
  );
}
