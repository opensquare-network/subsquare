import { useCallback, useEffect, useState } from "react";
import PopupLabel from "next-common/components/popup/label";
import SymbolSelectInput from "next-common/components/symbolSelectInput";
import { TransferrableBalance } from "next-common/components/popup/fields/transferAmountField";
import calcTransferable from "next-common/utils/account/transferable";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import { isHydrationChain } from "next-common/utils/chain";
import {
  DOT_SYMBOL,
  getTransferAsset,
  TRANSFER_SYMBOLS,
} from "./transferAssets";

export { DOT_SYMBOL };

export default function useTransferAmount({
  sourceChain,
  api,
  transferFromAddress,
}) {
  const [symbol, setSymbol] = useState(DOT_SYMBOL);
  const { decimals } = getTransferAsset(symbol);

  const [transferAmount, setTransferAmount] = useState("");
  const [transferrable, setTransferrable] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsub;

    if (!api || !transferFromAddress) {
      setTransferrable("0");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const asset = getTransferAsset(symbol);
    // Split the balance logic by the source chain up front: the storage the
    // balance lives in and the way the native ED is applied differ per chain,
    // so each branch below handles its own query and normalization.
    const isHydrationSource = isHydrationChain(sourceChain);

    const updateTransferrable = (accountData, nativeExistentialDeposit) => {
      setTransferrable(
        calcTransferable(
          { free: 0, reserved: 0, frozen: 0, ...accountData },
          nativeExistentialDeposit,
        ),
      );
      setIsLoading(false);
    };

    if (isHydrationSource) {
      // Hydration: every supported asset is a foreign asset of the tokens
      // pallet, whose ED is not enforced on the source.
      api.query.tokens
        ?.accounts(transferFromAddress, asset.hydrationAssetId, (account) =>
          updateTransferrable(account?.toJSON?.() || {}, 0),
        )
        ?.then((result) => (unsub = result));
    } else if (asset.assetHubAssetId != null) {
      // Asset Hub: USDC/USDt are assets pallet assets. The account is a flat
      // record whose balance lives in `balance` (not `free`); the whole
      // balance is frozen when `isFrozen` is set.
      api.query.assets
        ?.account(asset.assetHubAssetId, transferFromAddress, (account) => {
          const json = account?.toJSON?.() || {};
          updateTransferrable(
            {
              free: json.balance,
              reserved: 0,
              frozen: json.isFrozen ? json.balance : 0,
            },
            0,
          );
        })
        ?.then((result) => (unsub = result));
    } else {
      // Asset Hub: DOT is native (system pallet) and keeps the balances pallet
      // ED; system.account nests the balances under `data`.
      const nativeExistentialDeposit =
        api.consts.balances?.existentialDeposit?.toJSON?.() || 0;
      api.query.system
        ?.account(transferFromAddress, (account) => {
          const json = account?.toJSON?.() || {};
          updateTransferrable(json.data || json, nativeExistentialDeposit);
        })
        ?.then((result) => (unsub = result));
    }

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, sourceChain, transferFromAddress, symbol]);

  const getCheckedValue = useCallback(() => {
    return checkTransferAmount({
      transferAmount,
      decimals,
      transferrable,
    });
  }, [transferAmount, decimals, transferrable]);

  const balanceStatus = (
    <TransferrableBalance
      value={transferrable}
      isLoading={isLoading}
      decimals={decimals}
    />
  );

  const component = (
    <div>
      <PopupLabel text="Amount" status={balanceStatus} />
      <SymbolSelectInput
        symbolOptions={TRANSFER_SYMBOLS}
        disabled={isLoading}
        value={transferAmount}
        onValueChange={setTransferAmount}
        symbol={symbol}
        onSymbolChange={setSymbol}
      />
    </div>
  );

  return {
    value: transferAmount,
    symbol,
    getCheckedValue,
    component,
  };
}
