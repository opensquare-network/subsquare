import AddressComboField from "next-common/components/popup/fields/addressComboField";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { usePageProps } from "next-common/context/page";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "../common/advanceSettings";
import BlocksField from "next-common/components/popup/fields/blocksField";
import BigNumber from "bignumber.js";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";
import Popup from "next-common/components/popup/wrapper/Popup";
import {
  USDxBalance,
  useUSDxTreasuryNotePreimageTx,
} from "next-common/components/preImages/submitPreimagePopup/newUSDxTreasuryProposalPopup";

function PopupContent() {
  const { tracks } = usePageProps();
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = useTrackDetail(trackId);
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const [enactment, setEnactment] = useState();
  const [symbol, setSymbol] = useState("USDt");
  const [validFrom, setValidFrom] = useState("");

  // 1 DOT = 10 USDx
  const nativeTokenPrice = 10;
  const tokenAmount = new BigNumber(inputBalance)
    .div(nativeTokenPrice)
    .toNumber();

  const { encodedHash, encodedLength, notePreimageTx } =
    useUSDxTreasuryNotePreimageTx(inputBalance, beneficiary, validFrom, symbol);

  return (
    <>
      <SignerWithBalance title="Origin" />
      <USDxBalance
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
        symbol={symbol}
        setSymbol={setSymbol}
      />
      <div className="flex flex-col gap-[8px]">
        <AddressComboField
          title="Beneficiary"
          extensionAccounts={extensionAccounts}
          defaultAddress={realAddress}
          setAddress={setBeneficiary}
        />
        <InfoMessage>Please fill the address from AssetHub</InfoMessage>
      </div>
      <AutoSelectTreasuryTrack
        requestAmount={tokenAmount}
        trackId={trackId}
        setTrackId={setTrackId}
      />
      <AdvanceSettings>
        <BlocksField
          title="Valid From"
          value={validFrom}
          setValue={setValidFrom}
        />
        <EnactmentBlocks track={track} setEnactment={setEnactment} />
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateProposalSubmitButton
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
        />
      </div>
    </>
  );
}

export function NewUSDxTreasuryReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create USDx Treasury Proposal" onClose={onClose} wide>
      <AssetHubApiProvider>
        <PopupContent />
      </AssetHubApiProvider>
    </Popup>
  );
}
