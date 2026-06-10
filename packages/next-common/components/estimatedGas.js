import React from "react";
import { toPrecision } from "next-common/utils";
import { GreyPanel } from "./styled/containers/greyPanel";
import { isNil } from "lodash-es";
import LoadableContent from "./common/loadableContent";
import { useChainSettings } from "next-common/context/chain";
import { useFeeAssetConfig } from "./popupWithSigner/context/feeAsset";
import FeeAssetTypeSwitcher from "./popup/fields/feeAssetTypeSwitcher";
import InsufficientFeeWarning from "./estimatedGas/insufficientFeeWarning";
import useAccountNonce from "next-common/hooks/useAccountNonce";
import useGasFeeEstimate from "next-common/hooks/useGasFeeEstimate";
import useShouldSendEvmTx from "next-common/hooks/useShouldSendEvmTx";

export default function EstimatedGas({ getTxFunc }) {
  const { enableAssetFee } = useChainSettings();
  const { feeAssetType, feeAssetInfo } = useFeeAssetConfig();
  const { accountNonce, isLoading: isNonceLoading } = useAccountNonce();
  const { gasFee, isGasFeeLoading } = useGasFeeEstimate(
    getTxFunc,
    feeAssetType,
  );
  const shouldSendEvmTx = useShouldSendEvmTx();

  return (
    <div className="gap-y-2">
      <GreyPanel className="flex-col gap-y-1 justify-start !items-start text14Medium text-textSecondary px-4 py-2.5 relative">
        {enableAssetFee && !shouldSendEvmTx && <FeeAssetTypeSwitcher />}

        <div className="flex gap-x-2 items-center">
          <span>Estimated Gas Fee: </span>
          <LoadableContent isLoading={isGasFeeLoading} size={20}>
            <span>
              {isNil(gasFee)
                ? "-"
                : `≈ ${toPrecision(gasFee, feeAssetInfo.decimals, 4)} ${
                    feeAssetInfo.symbol
                  }`}
            </span>
          </LoadableContent>
        </div>
        <span className="flex gap-x-2">
          Nonce:{" "}
          <LoadableContent isLoading={isNonceLoading} size={20}>
            <span>{!isNil(accountNonce) && accountNonce}</span>
          </LoadableContent>
        </span>
      </GreyPanel>
      <InsufficientFeeWarning
        feeAssetType={feeAssetType}
        feeAssetInfo={feeAssetInfo}
        gasFee={gasFee}
        isGasFeeLoading={isGasFeeLoading}
      />
    </div>
  );
}
