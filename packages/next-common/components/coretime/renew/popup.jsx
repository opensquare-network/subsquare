import { useCallback } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import Signer from "next-common/components/popup/fields/signerField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import Labeled from "next-common/components/Labeled";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { toPrecision } from "next-common/utils";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import RenewalTasks from "./tasks";
import RenewalTimeRange from "./timeRange";

function PopupContent({ core, renewal }) {
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const price = renewal?.price.toString();
  const { transferrable, isLoading: isBalanceLoading } =
    useAccountTransferrable(api, signerAccount?.realAddress);
  let disabledReason;
  if (!renewal) {
    disabledReason = "Renewal unavailable";
  } else if (isBalanceLoading) {
    disabledReason = "Loading balance...";
  }

  const getTxFunc = useCallback(() => {
    if (disabledReason) {
      throw new Error(disabledReason);
    }

    checkTransferAmount({
      transferAmount: price,
      decimals: 0,
      transferrable,
    });

    return api.tx.broker.renew(core);
  }, [api, core, disabledReason, price, transferrable]);

  return (
    <>
      <Signer
        balance={transferrable}
        isBalanceLoading={isBalanceLoading}
        showTransferable
      />
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <Labeled text="Renewal price">
          {renewal ? (
            <ValueDisplay
              value={toPrecision(price, decimals)}
              symbol={symbol}
            />
          ) : (
            "-"
          )}
        </Labeled>
        <RenewalTimeRange />
      </div>
      <RenewalTasks renewal={renewal} />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Renew"
            getTxFunc={getTxFunc}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function CoretimeRenewPopup({ core, renewal, ...props }) {
  return (
    <PopupWithSigner title={`Renew core #${core}`} {...props}>
      <PopupContent core={core} renewal={renewal} />
    </PopupWithSigner>
  );
}
