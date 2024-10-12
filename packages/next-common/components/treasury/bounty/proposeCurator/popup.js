import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useOnchainData } from "next-common/context/post";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback } from "react";
import useFeeAmount from "../../childBounty/proposeCurator/useFeeAmount";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import { useDispatch } from "react-redux";
import { useContextApi } from "next-common/context/api";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { useChainSettings } from "next-common/context/chain";
import { usePopupOnClose } from "next-common/context/popup";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAutoSelectTreasuryTrackField from "next-common/components/summary/newProposalQuickStart/common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "next-common/components/summary/newProposalQuickStart/common/useEnactmentBlocksField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import SubmissionDeposit from "next-common/components/summary/newProposalPopup/submissionDeposit";
import { useReferendaProposalOrigin } from "next-common/components/summary/newProposalPopup";
import { toPrecision } from "next-common/utils";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { InfoMessage } from "next-common/components/setting/styled";

function PopupContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const onClose = usePopupOnClose();
  const { decimals, symbol } = useChainSettings();
  const api = useContextApi();

  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const { value: signerBalance, loading: signerBalanceLoading } =
    useSubBalanceInfo(address);

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
      dispatch(newErrorToast("Curator address is required"));
      return;
    }

    let fee;
    try {
      fee = getCheckedFee();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    const proposal = api.tx.bounties?.proposeCurator(bountyIndex, curator, fee);
    return api.tx.referenda.submit(
      proposalOrigin,
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [
    curator,
    getCheckedFee,
    bountyIndex,
    api,
    dispatch,
    proposalOrigin,
    enactment,
  ]);

  return (
    <>
      <Signer
        balance={signerBalance?.balance}
        isBalanceLoading={signerBalanceLoading}
        title="Origin"
      />
      {curatorSelect}
      {feeField}
      <div className="flex flex-col gap-[8px]">
        {trackField}
        <InfoMessage>
          A referendum will be created for curator proposing.
        </InfoMessage>
      </div>
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>

      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
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
      </div>
    </>
  );
}

export default function BountyProposeCuratorPopup({ onClose }) {
  return (
    <PopupWithSigner
      title="Propose Curator"
      className="!w-[640px]"
      onClose={onClose}
    >
      <PopupContent />
    </PopupWithSigner>
  );
}
