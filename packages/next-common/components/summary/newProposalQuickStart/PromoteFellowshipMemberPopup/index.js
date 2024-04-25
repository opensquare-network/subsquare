import AddressComboField from "next-common/components/popup/fields/addressComboField";
import RankField from "next-common/components/popup/fields/rankField";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
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
import { useRouter } from "next/router";
import { InfoMessage } from "next-common/components/setting/styled";
import { textEllipsis } from "next-common/utils";

function PopupContent({ member, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enactment, setEnactment] = useState();
  const isMounted = useIsMounted();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();
  const [toRank, setToRank] = useState(member?.rank + 1);
  const trackName = `PromoteTo${toRank}Dan`;
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
    let tx = api.tx.fellowshipReferenda.submit(
      { FellowshipOrigins: trackName },
      { Inline: proposal.method.toHex() },
      enactment,
    );
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
        section: "fellowshipReferenda",
        method: "Submitted",
        onInBlock: (eventData) => {
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/fellowship/referenda/${referendumIndex}`);
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
    trackName,
    memberAddress,
    enactment,
    signerAccount,
    dispatch,
    isMounted,
    router,
  ]);

  return (
    <>
      <SignerWithBalance />
      <AddressComboField
        title="Member"
        extensionAccounts={extensionAccounts}
        defaultAddress={memberAddress}
        setAddress={setMemberAddress}
        readOnly
      />
      <RankField title="To Rank" rank={toRank} setRank={setToRank} />
      <EnactmentBlocks setEnactment={setEnactment} />
      <InfoMessage>
        Will create a referendum in {trackName} track to promote{" "}
        {textEllipsis(memberAddress, 4, 4)}
      </InfoMessage>
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
