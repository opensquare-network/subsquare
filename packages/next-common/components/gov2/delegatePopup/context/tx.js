import { createContext, useCallback } from "react";
import { usePopupSendTransaction } from "next-common/hooks/usePopupSendTransaction";
import { wrapWithProxy } from "next-common/utils/sendTx";
import { noop } from "lodash-es";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

const TransactionContext = createContext();

export default TransactionContext;

export function TransactionProvider({ children }) {
  const signerAccount = useSignerAccount();
  const { sendTx, isLoading } = usePopupSendTransaction();

  const submitSubstrateExtrinsic = useCallback(
    async ({
      api,
      trackIds,
      conviction,
      bnVoteBalance,
      targetAddress,
      onInBlock = noop,
    }) => {
      let tx;
      if (trackIds.length === 1) {
        tx = api.tx.convictionVoting.delegate(
          trackIds[0],
          targetAddress,
          conviction,
          bnVoteBalance.toString(),
        );
      } else {
        tx = api.tx.utility.batch(
          trackIds.map((trackId) =>
            api.tx.convictionVoting.delegate(
              trackId,
              targetAddress,
              conviction,
              bnVoteBalance.toString(),
            ),
          ),
        );
      }

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        api,
        tx,
        onInBlock,
      });
    },
    [sendTx, signerAccount],
  );

  return (
    <TransactionContext.Provider
      value={{ submitExtrinsic: submitSubstrateExtrinsic, isLoading }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
