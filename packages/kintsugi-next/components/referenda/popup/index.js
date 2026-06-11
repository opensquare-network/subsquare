import { useCallback, useState } from "react";
import { isNil } from "lodash-es";
import { useAddressVotingBalance } from "next-common/utils/hooks/useAddressVotingBalance";
import { checkInputValue } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import Signer from "next-common/components/popup/fields/signerField";
import VoteBalance from "./voteBalance";
import VotingStatus from "./votingStatus";
import VoteButton from "next-common/components/popup/voteButton";
import { VoteEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import useSubMyDemocracyVote, {
  getKintDemocracyDirectVote,
} from "../../../hooks/democracy/useSubMyDemocracyVote";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

function PopupContent() {
  const { referendumIndex, onClose } = usePopupParams();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();

  const node = useChainSettings();
  const [loadingState, setLoadingState] = useState();
  const api = useContextApi();
  const { balance: votingBalance, isLoading: votingIsLoading } =
    useAddressVotingBalance(api, signerAccount?.realAddress);
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

  const onInBlock = useCallback(() => {
    getMyVoteAndShowSuccessful();
  }, [getMyVoteAndShowSuccessful]);

  const getTxFunc = useCallback(
    (aye) => {
      if (isNil(referendumIndex) || !node) {
        return;
      }

      const bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
        true,
      );

      if (bnVoteBalance.gt(votingBalance)) {
        throw new Error("Insufficient voting balance");
      }

      return api.tx.democracy.vote(referendumIndex, {
        aye,
        balance: bnVoteBalance.toString(),
      });
    },
    [api, inputVoteBalance, referendumIndex, votingBalance, node],
  );

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onSubmitted: onClose,
  });

  const doVote = useCallback(
    async (aye) => {
      setLoadingState(aye ? VoteEnum.Aye : VoteEnum.Nay);
      await doSubmit(aye);
    },
    [doSubmit],
  );

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
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
      <AdvanceSettings>
        <EstimatedGas getTxFunc={() => getTxFunc(true)} />
      </AdvanceSettings>
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
