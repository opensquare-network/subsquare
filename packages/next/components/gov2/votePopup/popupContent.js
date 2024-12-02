import { useCallback, useEffect, useState } from "react";
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
import useSubMyReferendaVote, { getReferendaDirectVote } from "next-common/hooks/referenda/useSubMyReferendaVote";
import { usePopupParams, useSignerAccount } from "next-common/components/popupWithSigner/context";
import { LoadingPanel } from "components/referenda/popup/popupContent";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { useContextApi } from "next-common/context/api";
import useStandardVote from "components/referenda/popup/voteHooks/useStandardVote";
import useSplitVote from "components/referenda/popup/voteHooks/useSplitVote";
import useSplitAbstainVote from "./voteHooks/useSplitAbstainVote";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import useReferendaVotingBalance from "next-common/hooks/referenda/useReferendaVotingBalance";

function VotePanel({
  referendumIndex,
  onInBlock = noop,
  votingBalance,
  addressVote,
  addressVoteIsLoading,
  onClose,
}) {
  const [tabIndex, setTabIndex] = useState(Aye);
  const node = useChainSettings();
  const [isLoading, setIsLoading] = useState(false);
  const votes = normalizeOnchainVote(addressVote);
  const hasVote =
    addressVote?.standard || addressVote?.split || addressVote?.splitAbstain;
  const hasDelegatedVote =
    addressVote?.delegating && addressVote?.delegating?.voted;
  const isDelegated = !!addressVote?.delegating;

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

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc: getVoteTx,
    onInBlock,
    onSubmitted: onClose,
  });

  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting]);

  return (
    <>
      {!isDelegated && (
        // Address is not allow to vote directly when it is in delegate mode
        <>
          <VoteTypeTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
          {voteComponent}
        </>
      )}

      {isDelegated && (
        // If the address has set to delegate mode, show the delegating setting instead
        <Delegating addressVoteDelegate={addressVote?.delegating} node={node} />
      )}

      {!addressVoteIsLoading && !hasVote && !hasDelegatedVote && (
        <NoVoteRecord />
      )}
      {hasVote && (
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
      {hasDelegatedVote && <StandardVoteStatus votes={votes} />}
      {addressVoteIsLoading && <LoadingVoteStatus />}

      {!isDelegated && (
        // Address is not allow to vote directly when it is in delegate mode
        <div style={{ textAlign: "right" }}>
          <PrimaryButton loading={isLoading} onClick={doSubmit}>
            Confirm
          </PrimaryButton>
        </div>
      )}
    </>
  );
}

export default function PopupContent() {
  const { referendumIndex, trackId, onClose } = usePopupParams();
  const showVoteSuccessful = useShowVoteSuccessful();
  const signerAccount = useSignerAccount();

  const api = useContextApi();
  const {
    isLoading: votingIsLoading,
    balance: votingBalance,
  } = useReferendaVotingBalance(api, signerAccount?.realAddress);

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
      />
      {content}
    </>
  );
}
