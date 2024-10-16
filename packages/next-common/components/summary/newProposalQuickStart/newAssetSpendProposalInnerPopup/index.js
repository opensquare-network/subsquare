import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import { useChainSettings } from "next-common/context/chain";
import useTrackField from "../common/useTrackField";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { addressToPublicKey } from "next-common/utils/address";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import { InfoMessage } from "next-common/components/setting/styled";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import { useDefaultTrackId } from "../../newProposalPopup/useTrackDetail";
import { useSubmissionDeposit } from "../common/useSubmissionDeposit";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import Tooltip from "next-common/components/tooltip";

const getAssetKindParam = () => {
  return {
    V3: {
      location: {
        parents: 1,
        interior: {
          X1: {
            Parachain: 1000,
          },
        },
      },
      assetId: {
        Concrete: {
          parents: 1,
          interior: {
            here: null,
          },
        },
      },
    },
  };
};

const getBeneficiaryParam = (beneficiary) => {
  return {
    V3: {
      parents: 0,
      interior: {
        X1: {
          AccountId32: {
            network: null,
            id: "0x" + addressToPublicKey(beneficiary),
          },
        },
      },
    },
  };
};

export function useAssetHubNativeTreasuryNotePreimageTx(
  inputBalance,
  beneficiary,
  validFrom,
) {
  const api = useContextApi();
  const { decimals } = useChainSettings();

  return useMemo(() => {
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
      const proposal = api.tx.fellowshipTreasury.spend(
        getAssetKindParam(),
        bnValue.toFixed(),
        getBeneficiaryParam(beneficiary),
        validFrom ? parseInt(validFrom) : null,
      );

      return getState(api, proposal);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [api, inputBalance, beneficiary, validFrom, decimals]);
}

function CreateProposalSubmitButtonWithRankCheck({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
}) {
  const { members } = useFellowshipCoreMembers();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;
  const me = find(members, { address: realAddress });

  const myRankOk = me && me.rank >= 3;

  const submitButton = (
    <CreateProposalSubmitButton
      disabled={!myRankOk}
      trackId={trackId}
      enactment={enactment}
      encodedHash={encodedHash}
      encodedLength={encodedLength}
      notePreimageTx={notePreimageTx}
    />
  );

  if (myRankOk) {
    return submitButton;
  }

  return (
    <Tooltip content="Only available to the members with rank >= 3">
      {submitButton}
    </Tooltip>
  );
}

export function NewAssetSpendProposalInnerPopup() {
  const defaultTrackId = useDefaultTrackId();

  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: trackId, component: trackField } =
    useTrackField(defaultTrackId);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { component: submissionDepositField } = useSubmissionDeposit();

  const { encodedHash, encodedLength, notePreimageTx } =
    useAssetHubNativeTreasuryNotePreimageTx(
      inputBalance,
      beneficiary,
      validFrom,
    );

  return (
    <Popup
      title="Create Treasury Proposal"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <SignerWithBalance />
      {balanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>Please fill the address from AssetHub</InfoMessage>
      </div>
      {trackField}
      <AdvanceSettings>
        {validFromField}
        {enactmentField}
        {submissionDepositField}
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateProposalSubmitButtonWithRankCheck
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
        />
      </div>
    </Popup>
  );
}
