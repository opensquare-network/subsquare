import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import isNil from "lodash.isnil";
import { useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, emptyFunction } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Signer from "next-common/components/popup/fields/signerField";
import VoteBalance from "./voteBalance";
import VotingStatus from "./votingStatus";
import VoteButton from "next-common/components/popup/voteButton";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import useSubMyDemocracyVote, {
  getDemocracyDirectVote,
} from "next-common/hooks/democracy/useSubMyVote";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useShowVoteSuccessful } from "next-common/components/vote";

function PopupContent({
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();

  const node = useChainSettings();
  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const api = useApi();
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );
  const { vote: addressVote, isLoading: addressVoteIsLoading } =
    useSubMyDemocracyVote(referendumIndex, signerAccount?.realAddress);
  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const isMounted = useIsMounted();

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

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (aye) => {
    if (
      loadingState !== VoteLoadingEnum.None ||
      isNil(referendumIndex) ||
      !node
    ) {
      return;
    }

    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
      );
    } catch (err) {
      return showErrorToast(err.message);
    }

    if (bnVoteBalance.gt(votingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx.democracy.vote(referendumIndex, {
      aye,
      balance: bnVoteBalance.toString(),
    });

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    const signerAddress = signerAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: (loading) => {
        if (loading) {
          setLoadingState(aye ? VoteLoadingEnum.Aye : VoteLoadingEnum.Nay);
        } else {
          setLoadingState(VoteLoadingEnum.None);
        }
      },
      onInBlock: () => {
        getMyVoteAndShowSuccessful();
        onInBlock();
      },
      onSubmitted,
      signerAddress,
      isMounted,
      onClose,
    });
  };

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
        symbol={node.voteSymbol}
      />
      <VoteBalance
        isLoading={loadingState !== VoteLoadingEnum.None}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
      />
      <VotingStatus
        addressVoteIsLoading={addressVoteIsLoading}
        addressVote={addressVote}
      />
      <VoteButton loadingState={loadingState} doVote={doVote} />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner
      title="Referenda vote"
      Component={PopupContent}
      {...props}
    />
  );
}
