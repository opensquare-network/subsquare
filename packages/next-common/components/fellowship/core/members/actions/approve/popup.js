import AddressComboField from "next-common/components/popup/fields/addressComboField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { getEventData } from "next-common/utils/sendTransaction";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import EnactmentBlocks from "next-common/components/summary/newProposalPopup/enactmentBlocks";
import { useRouter } from "next/router";
import { InfoMessage } from "next-common/components/setting/styled";
import AddressUser from "next-common/components/user/addressUser";
import RankField from "next-common/components/popup/fields/rankField";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Chains from "next-common/utils/consts/chains";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";

export function getRetainTrackNameFromRank(rank) {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesRetainTracks[rank];
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
  const [atRank, setAtRank] = useState(member?.rank);
  const trackName = getRetainTrackNameFromRank(atRank);
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const section = useCollectivesSection();

  const getTxFunc = useCallback(async () => {
    if (!api || !memberAddress) {
      return;
    }

    const proposal = api.tx.fellowshipCore.approve(memberAddress, atRank);
    return api.tx.fellowshipReferenda.submit(
      { FellowshipOrigins: trackName },
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [api, atRank, trackName, memberAddress, enactment]);

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
      <InfoMessage className="mb-4">
        <span>
          Will create a referendum in {trackName} track to approve{" "}
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
          router.push(`/${section}/referenda/${referendumIndex}`);
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
      />
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
