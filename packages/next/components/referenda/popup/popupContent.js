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

import { useChainSettings } from "next-common/context/chain";
import { Aye, Nay, Split } from "./ayeNaySplitTab";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import VStack from "next-common/components/styled/vStack";
import { WarningMessage } from "next-common/components/popup/styled";
import Loading from "next-common/components/loading";
import useIsLoaded from "next-common/hooks/useIsLoaded";

export default function PopupContent({
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
  useStandardVote,
  useSplitVote,
  VoteTypeTab,
  submitExtrinsic = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [tabIndex, setTabIndex] = useState(Aye);

  const signerAccount = useSignerAccount();

  const api = useApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );
  const { vote: addressVote, isLoading: addressVoteIsLoading } =
    useSubMyDemocracyVote(signerAccount?.realAddress);
  const addressVoteIsLoaded = useIsLoaded(addressVoteIsLoading);

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

    if (!getVoteTx) {
      return showErrorToast("Vote component is not ready yet");
    }

    await submitExtrinsic({
      api,
      getVoteTx,
      dispatch,
      setLoading: setIsLoading,
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
    });
  };

  let content = (
    <>
      <div className="flex w-full justify-center p-[8px]">
        <Loading size={20} />
      </div>
      <div style={{ textAlign: "right" }}>
        <PrimaryButton disabled={true}>Confirm</PrimaryButton>
      </div>
    </>
  );

  if (addressVoteIsLoaded) {
    content = (
      <>
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
        {(addressVote?.standard || addressVote?.split) && (
          <VStack space={8}>
            {addressVote?.standard && (
              <StandardVoteStatus addressVoteStandard={addressVote?.standard} />
            )}
            {addressVote?.split && (
              <SplitVoteStatus addressVoteSplit={addressVote?.split} />
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
            <PrimaryButton isLoading={isLoading} onClick={doVote}>
              Confirm
            </PrimaryButton>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      {content}
    </>
  );
}
