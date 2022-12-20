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
import CurrentVote from "./currentVote";
import useFellowshipVote from "next-common/utils/hooks/fellowship/useFellowshipVote";

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
    "FFFF3gBSSDFSvK2HBq4qgLH75DHqXWPHeCnR1BSksAMacBs"
  );

  const doVote = () => {};

  return (
    <>
      <Signer
        signerAccount={signerAccount}
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
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
