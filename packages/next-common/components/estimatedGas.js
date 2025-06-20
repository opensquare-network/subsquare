import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function EstimatedGas({ tx, address }) {
  const [fee, setFee] = useState(null);
  const { decimals, symbol } = useChainSettings();

  useEffect(() => {
    if (!tx || !address) {
      setFee(null);
      return;
    }
    tx.paymentInfo(address)
      .then((info) => {
        setFee(info.partialFee);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [tx, address]);

  if (!fee) {
    return null;
  }

  return (
    <div className="text14Medium text-textSecondary">
      Estimated Gas Fee: {toPrecision(fee, decimals)} {symbol}
    </div>
  );
}
