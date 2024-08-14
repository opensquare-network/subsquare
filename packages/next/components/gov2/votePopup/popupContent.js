import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import { useMountedState } from "react-use";
import { noop } from "lodash-es";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import NoVoteRecord from "components/referenda/popup/noVoteRecord";
import LoadingVoteStatus from "components/referenda/popup/loadingVoteStatus";
import Delegating from "components/referenda/popup/delegating";
import Signer from "next-common/components/popup/fields/signerField";

import { useChainSettings } from "next-common/context/chain";
import { WarningMessage } from "next-common/components/popup/styled";
import SplitAbstainVoteStatus from "./splitAbstainVoteStatus";
import VStack from "next-common/components/styled/vStack";
import VoteTypeTab, { Aye, Nay, Split, SplitAbstain } from "./tab";
import PrimaryButton from "next-common/lib/button/primary";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useSubMyReferendaVote, {
  getReferendaDirectVote,
} from "next-common/hooks/referenda/useSubMyReferendaVote";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { LoadingPanel } from "components/referenda/popup/popupContent";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

function VotePanel({
  referendumIndex,
  onInBlock = noop,
  useStandardVote,
  useSplitVote,
  useSplitAbstainVote,
  submitExtrinsic = noop,
  votingBalance,
  addressVote,
  addressVoteIsLoading,
  onClose,
}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [tabIndex, setTabIndex] = useState(Aye);

  const signerAccount = useSignerAccount();

  const api = useContextApi();
  const node = useChainSettings();

  const [isLoading, setIsLoading] = useState(false);

  const votes = normalizeOnchainVote(addressVote);

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  const { StandardVoteComponent, getStandardVoteTx } = useStandardVote({
    module: "convictionVoting",
    referendumIndex,
    isAye: tabIndex === Aye,
    addressVoteDelegations: addressVote?.delegations,
    isLoading,
    votingBalance,
  });
  const { SplitVoteComponent, getSplitVoteTx } = useSplitVote({
    module: "convictionVoting",
    referendumIndex,
    isLoading,
    votingBalance,
  });
  const { SplitAbstainVoteComponent, getSplitAbstainVoteTx } =
    useSplitAbstainVote({ referendumIndex, isLoading, votingBalance });

  let voteComponent = null;
  let getVoteTx = null;
  if (tabIndex === Aye || tabIndex === Nay) {
    voteComponent = StandardVoteComponent;
    getVoteTx = getStandardVoteTx;
  } else if (tabIndex === Split) {
    voteComponent = SplitVoteComponent;
    getVoteTx = getSplitVoteTx;
  } else if (tabIndex === SplitAbstain) {
    voteComponent = SplitAbstainVoteComponent;
    getVoteTx = getSplitAbstainVoteTx;
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
      signerAccount,
      isMounted,
      onClose,
    });
  };

  return (
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
          {addressVote?.standard && <StandardVoteStatus votes={votes} />}
          {addressVote?.split && <SplitVoteStatus votes={votes} />}
          {addressVote?.splitAbstain && (
            <SplitAbstainVoteStatus votes={votes} />
          )}
          <WarningMessage>
            Resubmitting the vote will override the current voting record
          </WarningMessage>
        </VStack>
      )}
      {addressVote?.delegating && addressVoteDelegateVoted && (
        <StandardVoteStatus votes={votes} />
      )}
      {addressVoteIsLoading && <LoadingVoteStatus />}

      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <div style={{ textAlign: "right" }}>
          <PrimaryButton loading={isLoading} onClick={doVote}>
            Confirm
          </PrimaryButton>
        </div>
      )}
    </>
  );
}

export default function PopupContent() {
  const {
    referendumIndex,
    trackId,
    onClose,
    useStandardVote,
    useSplitVote,
    useSplitAbstainVote,
    submitExtrinsic = noop,
  } = usePopupParams();
  const showVoteSuccessful = useShowVoteSuccessful();
  const signerAccount = useSignerAccount();

  const api = useContextApi();

  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );

  const {
    vote: addressVote,
    isLoading: addressVoteIsLoading,
    isLoaded: addressVoteIsLoaded,
  } = useSubMyReferendaVote(
    trackId,
    referendumIndex,
    signerAccount?.realAddress,
  );

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    const addressVote = await getReferendaDirectVote(
      api,
      signerAccount?.realAddress,
      trackId,
      referendumIndex,
    );
    if (!addressVote) {
      return;
    }
    showVoteSuccessful(addressVote);
  }, [
    api,
    trackId,
    referendumIndex,
    signerAccount?.realAddress,
    showVoteSuccessful,
  ]);

  let content = <LoadingPanel />;

  if (addressVoteIsLoaded) {
    content = (
      <VotePanel
        referendumIndex={referendumIndex}
        onInBlock={() => {
          getMyVoteAndShowSuccessful();
        }}
        onClose={onClose}
        useStandardVote={useStandardVote}
        useSplitVote={useSplitVote}
        useSplitAbstainVote={useSplitAbstainVote}
        submitExtrinsic={submitExtrinsic}
        votingBalance={votingBalance}
        addressVote={addressVote}
        addressVoteIsLoading={addressVoteIsLoading}
      />
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
