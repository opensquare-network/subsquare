import { useCallback, useEffect, useState } from "react";
import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import calcTransferable from "next-common/utils/account/transferable";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import { isHydrationChain } from "next-common/utils/chain";

// The transfer always moves the relay native (DOT).
export const DOT_SYMBOL = "DOT";
export const DOT_DECIMALS = 10;

// DOT is a foreign asset in Hydration's `tokens` pallet under this asset id.
export const HYDRATION_DOT_ASSET_ID = 5;

export default function useTransferAmount({
  sourceChain,
  api,
  transferFromAddress,
}) {
  const symbol = DOT_SYMBOL;
  const decimals = DOT_DECIMALS;

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

    const nativeExistentialDeposit =
      api.consts.balances?.existentialDeposit?.toJSON?.() || 0;

    const handleAccount = (account, isForeignAsset) => {
      const json = account?.toJSON?.() || {};
      // system.account nests the balances under `data`; tokens.accounts returns
      // a flat AccountData (or null when the account does not exist).
      const data = json.data || json;
      setTransferrable(
        calcTransferable(
          { free: 0, reserved: 0, frozen: 0, ...data },
          isForeignAsset ? 0 : nativeExistentialDeposit,
        ),
      );
      setIsLoading(false);
    };

    if (isHydrationChain(sourceChain)) {
      // DOT is a foreign asset (tokens pallet) on Hydration.
      api.query.tokens
        ?.accounts(transferFromAddress, HYDRATION_DOT_ASSET_ID, (account) =>
          handleAccount(account, true),
        )
        ?.then((result) => (unsub = result));
    } else {
      // DOT is native on Asset Hub.
      api.query.system
        ?.account(transferFromAddress, (account) =>
          handleAccount(account, false),
        )
        ?.then((result) => (unsub = result));
    }

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, sourceChain, transferFromAddress]);

  const getCheckedValue = useCallback(() => {
    return checkTransferAmount({
      transferAmount,
      decimals,
      transferrable,
    });
  }, [transferAmount, decimals, transferrable]);

  const component = (
    <TransferAmount
      transferrable={transferrable}
      decimals={decimals}
      symbol={symbol}
      isLoading={isLoading}
      transferAmount={transferAmount}
      setTransferAmount={setTransferAmount}
    />
  );

  return {
    value: transferAmount,
    getCheckedValue,
    component,
  };
}
