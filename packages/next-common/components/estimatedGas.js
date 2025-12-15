import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useSignerAccount } from "./popupWithSigner/context";
import { GreyPanel } from "./styled/containers/greyPanel";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import LoadableContent from "./common/loadableContent";

export default function EstimatedGas({ getTxFunc }) {
  const api = useContextApi();
  const [accountNonce, setAccountNonce] = useState();
  const [fee, setFee] = useState(null);
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const [tx, setTx] = useState(null);
  const [isGasLoading, setIsGasLoading] = useState(false);
  const [isNonceLoading, setIsNonceLoading] = useState(false);

  useEffect(() => {
    if (typeof getTxFunc !== "function") {
      return;
    }
    Promise.resolve(getTxFunc()).then(setTx);
  }, [getTxFunc]);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress) {
      return;
    }
    setIsNonceLoading(true);
    api.query.system
      .account(signerAccount?.realAddress)
      .then((account) => {
        setAccountNonce(account.nonce.toNumber());
      })
      .finally(() => {
        setIsNonceLoading(false);
      });
  }, [api, signerAccount?.realAddress]);

  const address = signerAccount?.realAddress;

  useEffect(() => {
    if (!tx || !address) {
      setFee(null);
      return;
    }
    setIsGasLoading(true);
    tx.paymentInfo(address)
      .then((info) => {
        setFee(info.partialFee);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsGasLoading(false);
      });
  }, [tx, address]);

  return (
    <GreyPanel className="flex-col gap-y-1 justify-start !items-start text14Medium text-textSecondary px-4 py-2.5">
      <div className="flex gap-x-2">
        <span>Estimated Gas Fee: </span>
        <LoadableContent isLoading={isGasLoading} size={20}>
          <span>
            {isNil(fee) ? "-" : `≈ ${toPrecision(fee, decimals, 4)} ${symbol}`}
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
  );
}
