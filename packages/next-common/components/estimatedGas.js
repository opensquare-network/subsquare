import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useSignerAccount } from "./popupWithSigner/context";
import Loading from "./loading";

export default function EstimatedGas({ getTxFunc }) {
  const [fee, setFee] = useState(null);
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const [tx, setTx] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof getTxFunc !== "function") {
      return;
    }
    Promise.resolve(getTxFunc()).then(setTx);
  }, [getTxFunc]);

  const address = signerAccount?.realAddress;

  useEffect(() => {
    if (!tx || !address) {
      setFee(null);
      return;
    }
    setIsLoading(true);
    tx.paymentInfo(address)
      .then((info) => {
        setFee(info.partialFee);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tx, address]);

  if (!fee) {
    return null;
  }

  return (
    <div className="text14Medium text-textSecondary flex items-center gap-x-2">
      {isLoading && <Loading size={16} />}
      <span>Estimated Gas Fee:</span>
      {toPrecision(fee, decimals)} {symbol}
    </div>
  );
}
