import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Signer from "next-common/components/popup/fields/signerField";

import useApi from "../../../../utils/hooks/useApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";
import PopupWithAddress from "../../../popupWithAddress";
import DepositRequired from "./depositRequired";
import SubmitButton from "./submitButton";
import { sendTx, wrapWithProxy } from "../../../../utils/sendTx";
import { emptyFunction } from "../../../../utils";
import useDeposit from "./useDeposit";
import isNil from "lodash.isnil";
import useSignerAccount from "../../../../utils/hooks/useSignerAccount";
import SecondPopupInputTimes from "./inputTimes";
import isMoonChain from "next-common/utils/isMoonChain";
import { encodeSecondData } from "next-common/utils/moonPrecompiles/democracy";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";
import isUseMetamask from "next-common/utils/isUseMetamask";

function PopupContent({
  extensionAccounts,
  proposalIndex,
  depositorUpperBound,
  depositRequired,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  useAddressVotingBalance,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const signerAccount = useSignerAccount(extensionAccounts);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const api = useApi();
  const [balance, loadingBalance] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );
  const { deposit, balanceInsufficient } = useDeposit(depositRequired, balance);
  const [times, setTimes] = useState(1);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (isNil(proposalIndex)) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    const signerAddress = signerAccount.address;

    if (isMoonChain() && isUseMetamask()) {
      let { callTo, callData } = encodeSecondData({
        propIndex: parseInt(proposalIndex),
        secondsUpperBound: parseInt(depositorUpperBound) || 1,
      });

      if (times > 1) {
        let toParam = [], valueParam = [], callDataParam = [], gasLimitParam = [];

        for (let n = 0; n < times; n++) {
          toParam.push(callTo);
          valueParam.push(0);
          callDataParam.push(callData);
          gasLimitParam.push(0);
        }

        ({ callTo, callData } = encodeBatchAllData({
          to: toParam,
          value: valueParam,
          callData: callDataParam,
          gasLimit: gasLimitParam,
        }));
      }

      if (signerAccount?.proxyAddress) {
        ({ callTo, callData } = encodeProxyData({
          real: signerAccount?.proxyAddress,
          callTo,
          callData,
        }));
      }

      await sendEvmTx({
        to: callTo,
        data: callData,
        dispatch,
        setLoading: setIsSubmitting,
        onInBlock,
        onClose,
        signerAddress,
        isMounted,
      });
    } else {
      let tx = null;
      try {
        if (api.tx.democracy?.second?.meta.args.length < 2) {
          tx = api.tx.democracy.second(proposalIndex);
        } else {
          tx = api.tx.democracy.second(proposalIndex, depositorUpperBound || 1);
        }
      } catch (e) {
        return showErrorToast(e.message);
      }

      if (times > 1) {
        const txs = Array.from({ length: times }).fill(tx);
        tx = api.tx.utility.batch(txs);
      }

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        dispatch,
        setLoading: setIsSubmitting,
        onFinalized,
        onInBlock,
        onSubmitted,
        onClose,
        signerAddress,
        isMounted,
      });
    }
  };

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balanceName="Voting balance"
        balance={balance}
        isBalanceLoading={loadingBalance}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <DepositRequired
        deposit={deposit}
        balanceInsufficient={balanceInsufficient}
      />
      <SecondPopupInputTimes
        times={times}
        setTimes={setTimes}
        currentTimes={depositorUpperBound}
        setSubmitDisabled={setSubmitDisabled}
      />
      <SubmitButton
        onClick={submit}
        balanceInsufficient={balanceInsufficient}
        isSubmitting={isSubmitting}
        disabled={submitDisabled}
      />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="Second" Component={PopupContent} {...props} />
  );
}
