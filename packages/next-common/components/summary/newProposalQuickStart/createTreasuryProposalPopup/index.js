import AddressComboField from "next-common/components/popup/fields/addressComboField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { isNil } from "lodash-es";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { getEventData } from "next-common/utils/sendTx";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue, upperFirstCamelCase } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import { useProposalOrigin } from "../../newProposalPopup";
import { useRouter } from "next/router";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupOnClose } from "next-common/context/popup";

function PopupContent() {
  const { onClose } = usePopupParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { tracks } = usePageProps();
  const api = useContextApi();
  const { decimals } = useChainSettings();
  const [isReloadingPreimageHashes, setIsReloadingPreimageHashes] =
    useState(false);
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = tracks.find((track) => track.id === trackId);
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const proposalOrigin = useProposalOrigin(trackId);
  const [enactment, setEnactment] = useState();
  const { treasuryProposalTracks } = useChainSettings();

  useEffect(() => {
    if (!treasuryProposalTracks || !inputBalance) {
      return;
    }
    const track = treasuryProposalTracks.find(
      (track) => isNil(track.max) || track.max >= parseFloat(inputBalance),
    );
    if (track) {
      setTrackId(track?.id);
    }
  }, [inputBalance, treasuryProposalTracks]);

  const { encodedHash, encodedLength, notePreimageTx } = useMemo(() => {
    if (!api || !inputBalance || !beneficiary) {
      return {};
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputBalance, decimals);
    } catch (err) {
      return {};
    }

    try {
      const spend = api.tx.treasury.spendLocal || api.tx.treasury.spend;
      const proposal = spend(bnValue.toFixed(), beneficiary);
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, inputBalance, beneficiary]);

  const preimages = useCombinedPreimageHashes();
  const preimageExists = useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);

  const getSubmitReferendaTx = () => {
    if (!api || !encodedHash) {
      return;
    }

    let proposalOriginValue = proposalOrigin;

    // When proposal origin is not defined in track detail, we use the track name as origin
    if (!proposalOriginValue) {
      if (track?.name === "root") {
        proposalOriginValue = { system: "Root" };
      } else {
        proposalOriginValue = { Origins: upperFirstCamelCase(track?.name) };
      }
    }

    return api.tx.referenda.submit(
      proposalOriginValue,
      {
        Lookup: {
          hash: encodedHash,
          len: encodedLength,
        },
      },
      enactment,
    );
  };

  return (
    <>
      <SignerWithBalance />
      <BalanceField
        title="Request"
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
      <AddressComboField
        title="Beneficiary"
        extensionAccounts={extensionAccounts}
        defaultAddress={realAddress}
        setAddress={setBeneficiary}
      />
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
      <EnactmentBlocks track={track} setEnactment={setEnactment} />
      <SubmissionDeposit />
      {preimageExists ? (
        <TxSubmissionButton
          title="Submit Proposal"
          getTxFunc={getSubmitReferendaTx}
          onInBlock={(events) => {
            const eventData = getEventData(events, "referenda", "Submitted");
            if (!eventData) {
              return;
            }
            const [referendumIndex] = eventData;
            router.push(`/referenda/${referendumIndex}`);
          }}
          onClose={onClose}
        />
      ) : (
        <TxSubmissionButton
          title="Create Preimage"
          getTxFunc={() => notePreimageTx}
          loading={isReloadingPreimageHashes}
          onInBlock={() => {
            setIsReloadingPreimageHashes(true);
            dispatch(incPreImagesTrigger());
          }}
        />
      )}
    </>
  );
}

export default function CreateTreasuryProposalPopup() {
  const onClose = usePopupOnClose();

  return (
    <PopupWithSigner title="Create Treasury Proposal" onClose={onClose} wide>
      <PopupContent />
    </PopupWithSigner>
  );
}
