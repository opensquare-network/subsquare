import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import { useMountedState } from "react-use";
import { noop } from "lodash-es";
import StandardVoteStatus from "./standardVoteStatus";
import SplitVoteStatus from "./splitVoteStatus";
import NoVoteRecord from "./noVoteRecord";
import LoadingVoteStatus from "./loadingVoteStatus";
import Delegating from "./delegating";
import Signer from "next-common/components/popup/fields/signerField";

import { useChainSettings } from "next-common/context/chain";
import { Aye, Nay, Split } from "./ayeNaySplitTab";
import PrimaryButton from "next-common/lib/button/primary";
import useSubMyDemocracyVote, {
  getDemocracyDirectVote,
} from "next-common/hooks/democracy/useSubMyVote";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import VStack from "next-common/components/styled/vStack";
import { WarningMessage } from "next-common/components/popup/styled";
import Loading from "next-common/components/loading";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

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
  onSubmitted = noop,
  onInBlock = noop,
  useStandardVote,
  useSplitVote,
  VoteTypeTab,
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
          {addressVote?.standard && <StandardVoteStatus votes={votes} />}
          {addressVote?.split && <SplitVoteStatus votes={votes} />}
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
    onClose,
    onSubmitted = noop,
    onInBlock = noop,
    useStandardVote,
    useSplitVote,
    VoteTypeTab,
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
        onSubmitted={onSubmitted}
        onInBlock={() => {
          getMyVoteAndShowSuccessful();
          onInBlock();
        }}
        onClose={onClose}
        useStandardVote={useStandardVote}
        useSplitVote={useSplitVote}
        VoteTypeTab={VoteTypeTab}
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
