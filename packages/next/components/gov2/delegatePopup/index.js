import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import {
  checkInputValue,
  emptyFunction,
  isSameAddress,
} from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useChainSettings } from "next-common/context/chain";
import Conviction from "next-common/components/popup/fields/convictionField";
import VoteValue from "next-common/components/democracy/delegatePopup/voteValue";
import Target from "next-common/components/democracy/delegatePopup/target";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import MultiTrack from "next-common/components/popup/fields/multiTrackField";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import isMoonChain from "next-common/utils/isMoonChain";
import { encodeDelegateData } from "next-common/utils/moonPrecompiles/convictionVoting";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";

function PopupContent({
  extensionAccounts,
  tracks,
  onClose,
  showTrackSelect = true,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const signerAccount = useSignerAccount(extensionAccounts);

  const [targetAddress, setTargetAddress] = useState("");

  const api = useApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address
  );

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [conviction, setConviction] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState(tracks);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doDelegate = async () => {
    if (isLoading) {
      return;
    }

    if (selectedTracks.length === 0) {
      return showErrorToast("Please select at least one track");
    }

    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance"
      );
    } catch (err) {
      return showErrorToast(err.message);
    }

    if (bnVoteBalance.times(selectedTracks.length).gt(votingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!targetAddress) {
      return showErrorToast("Please input a target address");
    }

    const signerAddress = signerAccount?.address;

    if (isSameAddress(targetAddress, signerAccount?.realAddress)) {
      return showErrorToast(
        "Target address cannot be same with the delegator address"
      );
    }

    if (isMoonChain() && isUseMetamask()) {
      let { callTo, callData } = encodeDelegateData({
        trackId: parseInt(track),
        targetAddress,
        conviction: parseInt(conviction),
        amount: BigInt(bnVoteBalance.toString()),
      });

      if (selectedTracks.length > 1) {
        let toParam = [], valueParam = [], callDataParam = [], gasLimitParam = [];

        for (let n = 0; n < selectedTracks.length; n++) {
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
        setLoading: setIsLoading,
        onInBlock,
        onClose,
        signerAddress,
        isMounted,
      });
    } else {
      let tx;
      if (selectedTracks.length === 1) {
        tx = api.tx.convictionVoting.delegate(
          selectedTracks[0],
          targetAddress,
          conviction,
          bnVoteBalance.toString()
        );
      } else {
        tx = api.tx.utility.batch(
          selectedTracks.map((trackId) =>
            api.tx.convictionVoting.delegate(
              trackId,
              targetAddress,
              conviction,
              bnVoteBalance.toString()
            )
          )
        );
      }

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        dispatch,
        setLoading: setIsLoading,
        onInBlock,
        onClose,
        signerAddress,
        isMounted,
      });
    }
  };

  const disabled = !(selectedTracks?.length > 0);

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />

      {showTrackSelect && (
        <MultiTrack
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
        />
      )}

      <Target
        extensionAccounts={extensionAccounts}
        setAddress={setTargetAddress}
      />
      <VoteValue
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction conviction={conviction} setConviction={setConviction} />
      <PopupButtonWrapper>
        <SecondaryButton
          isLoading={isLoading}
          disabled={disabled}
          onClick={doDelegate}
        >
          Confirm
        </SecondaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function DelegatePopup(props) {
  return (
    <PopupWithAddress
      title="Delegate"
      Component={PopupContent}
      autoCloseAfterLogin={true}
      {...props}
    />
  );
}
