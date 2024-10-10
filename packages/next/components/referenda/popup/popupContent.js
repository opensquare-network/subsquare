import { useCallback, useEffect, useState } from "react";
import { useAddressVotingBalance } from "utils/hooks";
import { noop } from "lodash-es";
import StandardVoteStatus from "./standardVoteStatus";
import SplitVoteStatus from "./splitVoteStatus";
import NoVoteRecord from "./noVoteRecord";
import LoadingVoteStatus from "./loadingVoteStatus";
import Delegating from "./delegating";
import Signer from "next-common/components/popup/fields/signerField";
import { Aye, Nay, Split } from "./ayeNaySplitTab";
import PrimaryButton from "next-common/lib/button/primary";
import useSubMyDemocracyVote, {
  getDemocracyDirectVote,
} from "next-common/hooks/democracy/useSubMyVote";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import VStack from "next-common/components/styled/vStack";
import { WarningMessage } from "next-common/components/popup/styled";
import Loading from "next-common/components/loading";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import AyeNaySplitTab from "./ayeNaySplitTab";
import useStandardVote from "./voteHooks/useStandardVote";
import useSplitVote from "./voteHooks/useSplitVote";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";

export function LoadingPanel() {
  return (
    <>
      <div className="flex w-full justify-center p-[8px]">
        <Loading size={20} />
      </div>
      <div style={{ textAlign: "right" }}>
        <PrimaryButton disabled={true}>Confirm</PrimaryButton>
      </div>
    </>
  );
}

function VotePanel({
  referendumIndex,
  onInBlock = noop,
  votingBalance,
  addressVote,
  addressVoteIsLoading,
  onClose,
}) {
  const [tabIndex, setTabIndex] = useState(Aye);
  const [isLoading, setIsLoading] = useState(false);
  const votes = normalizeOnchainVote(addressVote);
  const hasVote = addressVote?.standard || addressVote?.split;
  const hasDelegatedVote =
    addressVote?.delegating && addressVote?.delegating?.voted;
  const isDelegated = !!addressVote?.delegating;

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
          <AyeNaySplitTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
          {voteComponent}
        </>
      )}

      {isDelegated && (
        // If the address has set to delegate mode, show the delegating setting instead
        <Delegating addressVoteDelegate={addressVote?.delegating} />
      )}

      {!addressVoteIsLoading && !hasVote && !hasDelegatedVote && (
        <NoVoteRecord />
      )}
      {hasVote && (
        <VStack space={8}>
          {addressVote?.standard && <StandardVoteStatus votes={votes} />}
          {addressVote?.split && <SplitVoteStatus votes={votes} />}
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
  const { referendumIndex, onClose, onInBlock = noop } = usePopupParams();
  const showVoteSuccessful = useShowVoteSuccessful();
  const signerAccount = useSignerAccount();

  const api = useContextApi();
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const {
    vote: addressVote,
    isLoading: addressVoteIsLoading,
    isLoaded: addressVoteIsLoaded,
  } = useSubMyDemocracyVote(signerAccount?.realAddress);

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    const addressVote = await getDemocracyDirectVote(
      api,
      signerAccount?.realAddress,
      referendumIndex,
    );
    if (!addressVote) {
      return;
    }
    showVoteSuccessful(addressVote);
  }, [api, referendumIndex, signerAccount?.realAddress, showVoteSuccessful]);

  let content = <LoadingPanel />;

  if (addressVoteIsLoaded) {
    content = (
      <VotePanel
        referendumIndex={referendumIndex}
        onInBlock={() => {
          getMyVoteAndShowSuccessful();
          onInBlock();
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
