import AddressComboField from "next-common/components/popup/fields/addressComboField";
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
import EnactmentBlocks from "next-common/components/summary/newProposalPopup/enactmentBlocks";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import { InfoMessage } from "next-common/components/setting/styled";
import AddressUser from "next-common/components/user/addressUser";
import RankField from "next-common/components/popup/fields/rankField";

function PopupContent({ member, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enactment, setEnactment] = useState();
  const isMounted = useIsMounted();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();
  const [atRank, setAtRank] = useState(member?.rank);
  const trackName = `PromoteTo${atRank}Dan`;
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const [isLoading, setIsLoading] = useState(false);

  const doPromote = useCallback(async () => {
    if (!api || !memberAddress) {
      return;
    }

    const proposal = api.tx.fellowshipCore.approve(memberAddress, atRank);
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
    atRank,
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
      <RankField title="At Rank" rank={atRank} setRank={setAtRank} readOnly />
      <EnactmentBlocks setEnactment={setEnactment} />
      <InfoMessage>
        <span>
          Will create a referendum in {trackName} track to approve{" "}
          <div className="inline-flex relative top-[5px]">
            <AddressUser add={memberAddress} />
          </div>
        </span>
      </InfoMessage>
      <PopupButtonWrapper>
        <PrimaryButton loading={isLoading} onClick={doPromote}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function ApproveFellowshipMemberPopup({ member, onClose }) {
  return (
    <PopupWithSigner title="Approve Fellowship Member" onClose={onClose} wide>
      <PopupContent member={member} onClose={onClose} />
    </PopupWithSigner>
  );
}
