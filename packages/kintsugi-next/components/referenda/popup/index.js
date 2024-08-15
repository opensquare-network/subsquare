import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { isNil } from "lodash-es";
import { useAddressVotingBalance } from "utils/hooks";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Signer from "next-common/components/popup/fields/signerField";
import VoteBalance from "./voteBalance";
import VotingStatus from "./votingStatus";
import VoteButton from "next-common/components/popup/voteButton";
import { wrapWithProxy } from "next-common/utils/sendTx";
import { VoteEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import useSubMyDemocracyVote, {
  getKintDemocracyDirectVote,
} from "../../../hooks/democracy/useSubMyDemocracyVote";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";

function PopupContent() {
  const { referendumIndex, onClose } = usePopupParams();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();

  const { sendTx, isLoading: isSubmitting } = useSendTransaction();

  const node = useChainSettings();
  const [loadingState, setLoadingState] = useState();
  const api = useContextApi();
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

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    const addressVote = await getKintDemocracyDirectVote(
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
    if (isSubmitting || isNil(referendumIndex) || !node) {
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
      showErrorToast(err.message);
      return;
    }

    if (bnVoteBalance.gt(votingBalance)) {
      showErrorToast("Insufficient voting balance");
      return;
    }

    if (!signerAccount) {
      showErrorToast("Please select an account");
      return;
    }

    if (!api) {
      showErrorToast("Chain network is not connected yet");
      return;
    }

    let tx = api.tx.democracy.vote(referendumIndex, {
      aye,
      balance: bnVoteBalance.toString(),
    });

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    setLoadingState(aye ? VoteEnum.Aye : VoteEnum.Nay);
    await sendTx({
      api,
      tx,
      onInBlock: () => {
        getMyVoteAndShowSuccessful();
      },
      onSubmitted: onClose,
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
        isLoading={isSubmitting}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
      />
      <VotingStatus
        addressVoteIsLoading={addressVoteIsLoading}
        addressVote={addressVote}
      />
      <VoteButton
        loadingState={loadingState}
        isLoading={isSubmitting}
        doVote={doVote}
      />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="Referenda vote" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
