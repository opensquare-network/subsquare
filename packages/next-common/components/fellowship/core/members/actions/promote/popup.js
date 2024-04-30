import AddressComboField from "next-common/components/popup/fields/addressComboField";
import RankField from "next-common/components/popup/fields/rankField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import EnactmentBlocks from "next-common/components/summary/newProposalPopup/enactmentBlocks";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import { InfoMessage } from "next-common/components/setting/styled";
import AddressUser from "next-common/components/user/addressUser";
import Chains from "next-common/utils/consts/chains";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { getEventData } from "next-common/utils/sendTx";

const CollectivesPromoteTracks = {
  1: "PromoteTo1Dan",
  2: "PromoteTo2Dan",
  3: "PromoteTo3Dan",
  4: "PromoteTo4Dan",
  5: "PromoteTo5Dan",
  6: "PromoteTo6Dan",
};

function getTrackNameFromRank(rank) {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesPromoteTracks[rank];
    default:
      throw new Error("Unsupported chain");
  }
}

function PopupContent({ member, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enactment, setEnactment] = useState();
  const api = useContextApi();
  const extensionAccounts = useExtensionAccounts();
  const [toRank, setToRank] = useState(member?.rank + 1);
  const trackName = getTrackNameFromRank(toRank);
  const [memberAddress, setMemberAddress] = useState(member?.address);

  const getTxFunc = useCallback(async () => {
    if (!api || !memberAddress) {
      return;
    }

    if (toRank > 6) {
      dispatch(newErrorToast("Invalid rank"));
      return;
    }

    const proposal = api.tx.fellowshipCore.promote(memberAddress, toRank);
    return api.tx.fellowshipReferenda.submit(
      { FellowshipOrigins: trackName },
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [api, toRank, trackName, memberAddress, enactment, dispatch]);

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
        <span>
          Will create a referendum in {trackName} track to promote{" "}
          <div className="inline-flex relative top-[5px]">
            <AddressUser add={memberAddress} />
          </div>
        </span>
      </InfoMessage>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        onInBlock={(events) => {
          const eventData = getEventData(
            events,
            "fellowshipReferenda",
            "Submitted",
          );
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/fellowship/referenda/${referendumIndex}`);
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
      />
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
