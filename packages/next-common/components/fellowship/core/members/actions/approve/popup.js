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
import {
  useCollectivesSection,
  useCoreFellowshipPallet,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useRelatedRetentionReferenda from "next-common/hooks/fellowship/useRelatedRetentionReferenda";
import { ReferendaWarningMessage } from "next-common/components/summary/newProposalQuickStart/createFellowshipCoreMemberProposalPopup/common";
import { useChain } from "next-common/context/chain";

export function getRetainTrackNameFromRank(chain, rank) {
  switch (chain) {
    case Chains.collectives:
    case Chains.westendCollectives:
      return CollectivesRetainTracks[rank];
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
  const [atRank, setAtRank] = useState(member?.rank);
  const chain = useChain();
  const trackName = getRetainTrackNameFromRank(chain, atRank);
  const [memberAddress, setMemberAddress] = useState(member?.address);
  const section = useCollectivesSection();
  const referendaPallet = useReferendaFellowshipPallet();
  const corePallet = useCoreFellowshipPallet();

  const getTxFunc = useCallback(async () => {
    if (!api || !memberAddress) {
      return;
    }

    const proposal = api.tx[corePallet].approve(memberAddress, atRank);
    return api.tx[referendaPallet].submit(
      { FellowshipOrigins: trackName }, //TODO: not working for ambassador
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [
    api,
    atRank,
    trackName,
    memberAddress,
    enactment,
    corePallet,
    referendaPallet,
  ]);

  const { relatedReferenda, isLoading } = useRelatedRetentionReferenda(
    member?.address,
  );
  const referendaAlreadyCreated = relatedReferenda.length > 0;

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
      <InfoMessage className="mb-4">
        <span>
          Will create a referendum in {trackName} track to approve{" "}
          <div className="inline-flex relative top-[5px]">
            <AddressUser add={memberAddress} />
          </div>
        </span>
      </InfoMessage>
      <ReferendaWarningMessage
        isLoading={isLoading}
        relatedReferenda={relatedReferenda}
      />
      <AdvanceSettings>
        <EnactmentBlocks setEnactment={setEnactment} />
      </AdvanceSettings>
      <TxSubmissionButton
        disabled={isLoading || referendaAlreadyCreated}
        getTxFunc={getTxFunc}
        onInBlock={({ events }) => {
          const eventData = getEventData(events, referendaPallet, "Submitted");
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/${section}/referenda/${referendumIndex}`);
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
        api={api}
      />
    </>
  );
}

export default function ApproveFellowshipMemberPopup({ member, onClose }) {
  return (
    <PopupWithSigner title="Approve Fellowship Member" onClose={onClose}>
      <PopupContent member={member} onClose={onClose} />
    </PopupWithSigner>
  );
}
