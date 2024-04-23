import AddressComboField from "next-common/components/popup/fields/addressComboField";
import RankField from "next-common/components/popup/fields/rankField";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import PrimaryButton from "next-common/lib/button/primary";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

function PopupContent({ member, onClose }) {
  const dispatch = useDispatch();
  const [enactment, setEnactment] = useState();
  const isMounted = useIsMounted();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();
  const [toRank, setToRank] = useState(member?.rank + 1);
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const [isLoading, setIsLoading] = useState(false);

  const doPromote = useCallback(async () => {
    if (!api || !memberAddress) {
      return;
    }

    if (toRank > 6) {
      dispatch(newErrorToast("Invalid rank"));
      return;
    }

    const proposal = api.tx.fellowshipCore.promote(memberAddress, toRank);
    const { encodedHash, encodedLength, notePreimageTx } = getState(
      api,
      proposal,
    );
    const submitProposal = api.tx.fellowshipReferenda.submit(
      { FellowshipOrigins: `PromoteTo${toRank}Dan` },
      {
        Lookup: {
          hash: encodedHash,
          len: parseInt(encodedLength),
        },
      },
      enactment,
    );
    let tx = api.tx.utility.batchAll([notePreimageTx, submitProposal]);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    setIsLoading(true);
    try {
      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
        signerAccount,
        isMounted,
        onInBlock: () => {
          // TODO: redirect to newly created proposal page when it is inblock
        },
        onFinalized: () => dispatch(incPreImagesTrigger()),
      });
    } catch (error) {
      dispatch(newErrorToast(error.message));
      setIsLoading(false);
    }
  }, [
    api,
    onClose,
    toRank,
    memberAddress,
    enactment,
    signerAccount,
    dispatch,
    isMounted,
  ]);

  return (
    <>
      <SignerWithBalance />
      <AddressComboField
        title="Member"
        extensionAccounts={extensionAccounts}
        defaultAddress={memberAddress}
        setAddress={setMemberAddress}
      />
      <RankField rank={toRank} setRank={setToRank} />
      <EnactmentBlocks setEnactment={setEnactment} />
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={doPromote}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function PromoteFellowshipMemberPopup({ member, onClose }) {
  return (
    <PopupWithSigner title="Promote Fellowship Member" onClose={onClose} wide>
      <PopupContent member={member} onClose={onClose} />
    </PopupWithSigner>
  );
}
