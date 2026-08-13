import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import Tooltip from "next-common/components/tooltip";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";

function toFeePrecision(value, decimals) {
  const normalized = new BigNumber(value).dividedBy(10 ** decimals);
  let sig = 4;
  if (normalized.gt(1)) {
    const intPartLen = Math.ceil(Math.log10(Number(normalized) + 1));
    sig = Math.min(
      21,
      (normalized.gt(99999.9999) ? 0 : normalized.gt(999.9999) ? 2 : 4) +
        intPartLen,
    );
  }
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: sig,
  }).format(Number(normalized));
}

function FeeRow({ title, fee, loading }) {
  return (
    <div className="flex w-full justify-between items-center gap-x-2">
      <span className="text-textSecondary">{title}:</span>
      <LoadableContent isLoading={loading} size={20}>
        {isNil(fee) ? (
          <span>-</span>
        ) : (
          <Tooltip
            content={`${toPrecision(fee.amount, fee.decimals)} ${fee.symbol}`}
          >
            <span className="inline-flex items-center gap-x-1 text-textPrimary">
              {toFeePrecision(fee.amount, fee.decimals)}
              <span className="value-display-symbol text-textTertiary">
                {fee.symbol}
              </span>
            </span>
          </Tooltip>
        )}
      </LoadableContent>
    </div>
  );
}

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
