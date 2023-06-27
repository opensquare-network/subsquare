import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "components/referenda/popup/delegateVoteStatus";
import NoVoteRecord from "components/referenda/popup/noVoteRecord";
import LoadingVoteStatus from "components/referenda/popup/loadingVoteStatus";
import Delegating from "components/referenda/popup/delegating";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useChainSettings } from "next-common/context/chain";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import { WarningMessage } from "next-common/components/popup/styled";
import SplitAbstainVoteStatus from "./splitAbstainVoteStatus";
import VStack from "next-common/components/styled/vStack";
import VoteTypeTab, { Aye, Nay, Split, SplitAbstain } from "./tab";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useStandardVote from "components/referenda/popup/voteHooks/useStandardVote";
import useSplitVote from "components/referenda/popup/voteHooks/useSplitVote";
import useSplitAbstainVote from "./voteHooks/useSplitAbstainVote";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useSubMyReferendaVote from "next-common/hooks/referenda/useSubMyReferendaVote";
import isMoonChain from "next-common/utils/isMoonChain";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import isUseMetamask from "next-common/utils/isUseMetamask";

function PopupContent({
  extensionAccounts,
  referendumIndex,
  trackId,
  onClose,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [tabIndex, setTabIndex] = useState(Aye);

  const signerAccount = useSignerAccount(extensionAccounts);

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

  const { vote: addressVote, isLoading: addressVoteIsLoading } =
    useSubMyReferendaVote(trackId, referendumIndex, signerAccount?.realAddress);

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  const { StandardVoteComponent, getStandardVoteTx, getMoonStandardVoteTx } =
    useStandardVote({
      module: "convictionVoting",
      referendumIndex,
      isAye: tabIndex === Aye,
      addressVoteDelegations: addressVote?.delegations,
      isLoading,
      votingBalance,
    });
  const { SplitVoteComponent, getSplitVoteTx, getMoonSplitVoteTx } =
    useSplitVote({
      module: "convictionVoting",
      referendumIndex,
      isLoading,
      votingBalance,
    });
  const {
    SplitAbstainVoteComponent,
    getSplitAbstainVoteTx,
    getMoonSplitAbstainVoteTx,
  } = useSplitAbstainVote({ referendumIndex, isLoading, votingBalance });

  let voteComponent = null;
  let getVoteTx = null;
  let getMoonVoteTx = null;
  if (tabIndex === Aye || tabIndex === Nay) {
    voteComponent = StandardVoteComponent;
    getVoteTx = getStandardVoteTx;
    getMoonVoteTx = getMoonStandardVoteTx;
  } else if (tabIndex === Split) {
    voteComponent = SplitVoteComponent;
    getVoteTx = getSplitVoteTx;
    getMoonVoteTx = getMoonSplitVoteTx;
  } else if (tabIndex === SplitAbstain) {
    voteComponent = SplitAbstainVoteComponent;
    getVoteTx = getSplitAbstainVoteTx;
    getMoonVoteTx = getMoonSplitAbstainVoteTx;
  }

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async () => {
    if (isLoading || referendumIndex == null || !node) {
      return;
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    const signerAddress = signerAccount.address;

    if (isMoonChain() && isUseMetamask()) {
      let { callTo, callData } = getMoonVoteTx();

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
        onSubmitted,
        onClose,
        signerAddress,
        isMounted,
      });
    } else {
      let tx = getVoteTx();
      if (!tx) {
        return;
      }

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        dispatch,
        setLoading: setIsLoading,
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
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <>
          <VoteTypeTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
          {voteComponent}
        </>
      )}

      {addressVote?.delegating && (
        // If the address has set to delegate mode, show the delegating setting instead
        <Delegating addressVoteDelegate={addressVote?.delegating} node={node} />
      )}

      {!addressVoteIsLoading &&
        !addressVote?.standard &&
        !addressVote?.split &&
        !addressVote?.splitAbstain &&
        (!addressVote?.delegating || !addressVoteDelegateVoted) && (
          <NoVoteRecord />
        )}
      {(addressVote?.standard ||
        addressVote?.split ||
        addressVote?.splitAbstain) && (
        <VStack space={8}>
          {addressVote?.standard && (
            <StandardVoteStatus addressVoteStandard={addressVote?.standard} />
          )}
          {addressVote?.split && (
            <SplitVoteStatus addressVoteSplit={addressVote?.split} />
          )}
          {addressVote?.splitAbstain && (
            <SplitAbstainVoteStatus
              addressVoteSplit={addressVote?.splitAbstain}
            />
          )}
          <WarningMessage>
            Resubmitting the vote will override the current voting record
          </WarningMessage>
        </VStack>
      )}
      {addressVote?.delegating && addressVoteDelegateVoted && (
        <DelegateVoteStatus addressVoteDelegate={addressVote?.delegating} />
      )}
      {addressVoteIsLoading && <LoadingVoteStatus />}

      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <div style={{ textAlign: "right" }}>
          <SecondaryButton isLoading={isLoading} onClick={doVote}>
            Confirm
          </SecondaryButton>
        </div>
      )}
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Referendum vote"
      Component={PopupContent}
      {...props}
    />
  );
}
