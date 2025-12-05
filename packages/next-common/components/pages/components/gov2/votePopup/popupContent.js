import { useCallback, useEffect, useRef, useState } from "react";
import { noop } from "lodash-es";
import StandardVoteStatus from "next-common/components/pages/components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "next-common/components/pages/components/referenda/popup/splitVoteStatus";
import LoadingVoteStatus from "next-common/components/pages/components/referenda/popup/loadingVoteStatus";
import Delegating from "next-common/components/pages/components/referenda/popup/delegating";
import Signer from "next-common/components/popup/fields/signerField";
import { useChainSettings } from "next-common/context/chain";
import { WarningMessage } from "next-common/components/popup/styled";
import SplitAbstainVoteStatus from "./splitAbstainVoteStatus";
import VStack from "next-common/components/styled/vStack";
import VoteTypeTab, { Aye, Nay, Split, SplitAbstain } from "./tab";
import PrimaryButton from "next-common/lib/button/primary";
import useSubAddressReferendaVote, {
  getReferendaDirectVote,
} from "next-common/hooks/referenda/useSubMyReferendaVote";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { LoadingPanel } from "next-common/components/pages/components/referenda/popup/popupContent";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { useContextApi } from "next-common/context/api";
import useStandardVote from "next-common/components/pages/components/referenda/popup/voteHooks/useStandardVote";
import useSplitVote from "next-common/components/pages/components/referenda/popup/voteHooks/useSplitVote";
import useSplitAbstainVote from "./voteHooks/useSplitAbstainVote";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import useReferendaVotingBalance from "next-common/hooks/referenda/useReferendaVotingBalance";
import { useUpdateVotesFromServer } from "next-common/utils/gov2/useVotesFromServer";
import EstimatedGas from "next-common/components/estimatedGas";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";

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

  const { StandardVoteComponent, getStandardVoteTx, getStandardVoteFeeTx } =
    useStandardVote({
      module: "convictionVoting",
      referendumIndex,
      isAye: tabIndex === Aye,
      addressVoteDelegations: addressVote?.delegations,
      isLoading,
      votingBalance,
      showReUseLocks: true,
    });
  const { SplitVoteComponent, getSplitVoteTx, getSplitVoteFeeTx } =
    useSplitVote({
      module: "convictionVoting",
      referendumIndex,
      isLoading,
      votingBalance,
    });
  const {
    SplitAbstainVoteComponent,
    getSplitAbstainVoteTx,
    getSplitAbstainVoteFeeTx,
  } = useSplitAbstainVote({
    referendumIndex,
    isLoading,
    votingBalance,
  });

  let voteComponent = null;
  let getVoteTx = null;
  let getVoteFeeTx = null;
  if (tabIndex === Aye || tabIndex === Nay) {
    voteComponent = StandardVoteComponent;
    getVoteTx = getStandardVoteTx;
    getVoteFeeTx = getStandardVoteFeeTx;
  } else if (tabIndex === Split) {
    voteComponent = SplitVoteComponent;
    getVoteTx = getSplitVoteTx;
    getVoteFeeTx = getSplitVoteFeeTx;
  } else if (tabIndex === SplitAbstain) {
    voteComponent = SplitAbstainVoteComponent;
    getVoteTx = getSplitAbstainVoteTx;
    getVoteFeeTx = getSplitAbstainVoteFeeTx;
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
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getVoteFeeTx} />
      </AdvanceSettings>

      {!isDelegated && (
        // Address is not allow to vote directly when it is in delegate mode
        <div className="flex flex-col gap-y-2 items-end">
          <PrimaryButton loading={isLoading} onClick={doSubmit}>
            Submit
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
  const { update } = useUpdateVotesFromServer(referendumIndex);
  const hasShownSuccessRef = useRef(false);

  const api = useContextApi();
  const { isLoading: votingIsLoading, balance: votingBalance } =
    useReferendaVotingBalance(signerAccount?.realAddress);

  const {
    vote: addressVote,
    isLoading: addressVoteIsLoading,
    isLoaded: addressVoteIsLoaded,
  } = useSubAddressReferendaVote(
    trackId,
    referendumIndex,
    signerAccount?.realAddress,
  );

  const resetSuccessFlag = useCallback(() => {
    hasShownSuccessRef.current = false;
  }, []);

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    if (hasShownSuccessRef.current) {
      return;
    }

    const { vote: addressVote, delegations } =
      (await getReferendaDirectVote(
        api,
        signerAccount?.realAddress,
        trackId,
        referendumIndex,
      )) || {};

    if (addressVote) {
      hasShownSuccessRef.current = true;
      showVoteSuccessful(addressVote, delegations);
    }
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
          resetSuccessFlag();
          getMyVoteAndShowSuccessful();
          update();
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
        balanceName="Voting Balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
      />
      {content}
    </>
  );
}
