import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import VoteButton from "next-common/components/popup/voteButton";
import useFellowshipVote from "next-common/utils/hooks/fellowship/useFellowshipVote";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import CurrentVote from "./currentVote";
import Rank from "./rank";
import VStack from "next-common/components/styled/vStack";

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

  const signerAccount = useSignerAccount(extensionAccounts);

  const api = useApi();
  const node = useChainSettings();

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const [votingBalance, votingIsLoading] = useAddressBalance(
    api,
    signerAccount?.realAddress
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address
  );
  const { vote, isLoading: isLoadingVote } = useFellowshipVote(
    referendumIndex,
    signerAccount?.realAddress
  );

  const doVote = async (aye) => {
    if (
      loadingState !== VoteLoadingEnum.None ||
      referendumIndex == null ||
      !node
    ) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx.fellowshipCollective.vote(referendumIndex, aye);

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
      <VStack space={8}>
        <Signer
          signerAccount={signerAccount}
          balance={votingBalance}
          isBalanceLoading={votingIsLoading}
          signerBalance={signerBalance}
          isSignerBalanceLoading={isSignerBalanceLoading}
        />
        <Rank />
      </VStack>
      <CurrentVote currentVote={vote} isLoadingVote={isLoadingVote} />
      <VoteButton doVote={doVote} loadingState={loadingState} />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Fellowship vote"
      Component={PopupContent}
      {...props}
    />
  );
}
