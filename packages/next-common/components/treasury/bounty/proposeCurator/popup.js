import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useOnchainData } from "next-common/context/post";
import { useCallback } from "react";
import useFeeAmount from "../../childBounty/proposeCurator/useFeeAmount";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import { useChainSettings } from "next-common/context/chain";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAutoSelectTreasuryTrackField from "next-common/components/summary/newProposalQuickStart/common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "next-common/components/summary/newProposalQuickStart/common/useEnactmentBlocksField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import SubmissionDeposit from "next-common/components/summary/newProposalPopup/submissionDeposit";
import { useReferendaProposalOrigin } from "next-common/components/summary/newProposalPopup";
import { toPrecision } from "next-common/utils";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";
import { WarningMessage } from "next-common/components/setting/styled";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import EstimatedGas from "next-common/components/estimatedGas";

function PopupContent() {
  const router = useRouter();
  const { decimals, symbol } = useChainSettings();
  const api = useContextApi();

  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;

  const { meta } = useOnchainData();
  const bountyValueWithDecimals = toPrecision(meta?.value, decimals);

  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(bountyValueWithDecimals);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const proposalOrigin = useReferendaProposalOrigin(trackId);

  const { bountyIndex, address: bountyAddress } = useOnchainData();
  const { balance: bountyBalance, isLoading: bountyBalanceLoading } =
    useSubAddressBalance(bountyAddress);

  const { getCheckedValue: getCheckedFee, component: feeField } = useFeeAmount({
    balance: bountyBalance,
    decimals,
    symbol,
    address,
    isLoading: bountyBalanceLoading,
  });

  const { value: curator, component: curatorSelect } = useAddressComboField({
    title: "Curator",
  });

  const getTxFunc = useCallback(() => {
    if (!curator) {
      throw new Error("Curator address is required");
    }

    const fee = getCheckedFee();

    const proposal = api.tx.bounties?.proposeCurator(bountyIndex, curator, fee);
    return api.tx.referenda.submit(
      proposalOrigin,
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [curator, getCheckedFee, bountyIndex, api, proposalOrigin, enactment]);

  return (
    <>
      <SignerWithBalance />
      {curatorSelect}
      {feeField}
      {trackField}
      <WarningMessage className="flex gap-[8px] items-center">
        <WarningIcon /> A referendum will be created for curator proposing.
      </WarningMessage>
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>

      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onInBlock={({ events }) => {
            const eventData = getEventData(events, "referenda", "Submitted");
            if (!eventData) {
              return;
            }
            const [referendumIndex] = eventData;
            router.push(`/referenda/${referendumIndex}`);
          }}
        />
      </div>
    </>
  );
}

export default function BountyProposeCuratorPopup({ onClose }) {
  return (
    <PopupWithSigner title="Propose Curator" onClose={onClose}>
      <PopupContent />
    </PopupWithSigner>
  );
}
