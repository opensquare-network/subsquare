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
import { getEventData } from "next-common/utils/sendTransaction";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { CollectivesPromoteTracks } from "next-common/components/fellowship/core/members/actions/promote/constants";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";

export function getTrackNameFromRank(rank) {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesPromoteTracks[rank];
    default:
      throw new Error("Unsupported chain");
  }
}

function PopupContent({ member }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enactment, setEnactment] = useState();
  const api = useContextApi();
  const extensionAccounts = useExtensionAccounts();
  const [toRank, setToRank] = useState(member?.rank + 1);
  const trackName = getTrackNameFromRank(toRank);
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const section = useCollectivesSection();

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
      <RankField title="To Rank" rank={toRank} setRank={setToRank} readOnly />
      <AdvanceSettings>
        <EnactmentBlocks setEnactment={setEnactment} />
      </AdvanceSettings>
      <InfoMessage className="mb-4">
        <span>
          Will create a referendum in {trackName} track to promote{" "}
          <div className="inline-flex relative top-[5px]">
            <AddressUser add={memberAddress} />
          </div>
        </span>
      </InfoMessage>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={({ events }) => {
          const eventData = getEventData(
            events,
            "fellowshipReferenda",
            "Submitted",
          );
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/${section}/referenda/${referendumIndex}`);
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
      />
    </>
  );
}

export default function PromoteFellowshipMemberPopup({ member, onClose }) {
  return (
    <PopupWithSigner title="Promote Fellowship Member" onClose={onClose}>
      <PopupContent member={member} onClose={onClose} />
    </PopupWithSigner>
  );
}
