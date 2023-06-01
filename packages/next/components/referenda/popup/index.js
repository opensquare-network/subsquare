import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import StandardVoteStatus from "./standardVoteStatus";
import SplitVoteStatus from "./splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import NoVoteRecord from "./noVoteRecord";
import LoadingVoteStatus from "./loadingVoteStatus";
import Delegating from "./delegating";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useChainSettings } from "next-common/context/chain";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import VoteTypeTab, { Aye, Nay, Split } from "./tab";
import useStandardVote from "./voteHooks/useStandardVote";
import useSplitVote from "./voteHooks/useSplitVote";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";

function PopupContent({
  extensionAccounts,
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
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
  const { vote: addressVote, isLoading: addressVoteIsLoading } = useSubMyDemocracyVote();

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  const { StandardVoteComponent, getStandardVoteTx } = useStandardVote({
    module: "democracy",
    referendumIndex,
    isAye: tabIndex === Aye,
    addressVoteDelegations: addressVote?.delegations,
    isLoading,
    votingBalance,
  });
  const { SplitVoteComponent, getSplitVoteTx } = useSplitVote({
    module: "democracy",
    referendumIndex,
    isLoading,
    votingBalance,
  });

  let voteComponent = null;
  let getVoteTx = null;
  if (tabIndex === Aye || tabIndex === Nay) {
    voteComponent = StandardVoteComponent;
    getVoteTx = getStandardVoteTx;
  } else if (tabIndex === Split) {
    voteComponent = SplitVoteComponent;
    getVoteTx = getSplitVoteTx;
  }

  const doVote = async () => {
    if (isLoading || referendumIndex == null || !node) {
      return;
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = getVoteTx();
    if (!tx) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    const signerAddress = signerAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: setIsLoading,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
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
        <Delegating addressVoteDelegate={addressVote?.delegating} />
      )}

      {!addressVoteIsLoading &&
        !addressVote?.standard &&
        !addressVote?.split &&
        (!addressVote?.delegating || !addressVoteDelegateVoted) && (
          <NoVoteRecord />
        )}
      {addressVote?.standard && (
        <StandardVoteStatus addressVoteStandard={addressVote?.standard} />
      )}
      {addressVote?.split && (
        <SplitVoteStatus addressVoteSplit={addressVote?.split} />
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
