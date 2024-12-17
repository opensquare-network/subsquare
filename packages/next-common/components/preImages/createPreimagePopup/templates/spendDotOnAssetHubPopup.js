import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { addressToPublicKey } from "next-common/utils/address";
import { InfoMessage } from "next-common/components/setting/styled";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import useAssetHubDotBalanceField from "../fields/useAssetHubDotBalanceField";
import useAddressComboField from "../fields/useAddressComboField";
import useValidFromField from "../fields/useValidFromField";
import { useChainSettings } from "next-common/context/chain";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

const getAssetKindParam = () => {
  return {
    V4: {
      location: {
        parents: 0,
        interior: {
          X1: [
            {
              Parachain: 1000,
            },
          ],
        },
      },
      assetId: {
        parents: 1,
        interior: "here",
      },
    },
  };
};

const getBeneficiaryParam = (beneficiary) => {
  return {
    V4: {
      parents: 0,
      interior: {
        X1: [
          {
            AccountId32: {
              network: null,
              id: "0x" + addressToPublicKey(beneficiary),
            },
          },
        ],
      },
    },
  };
};

export function useSpendDotOnAssetHubPreimageTx(
  inputBalance,
  beneficiary,
  validFrom,
) {
  const { decimals } = useChainSettings();
  const api = useContextApi();

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
      const proposal = api.tx.treasury.spend(
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

function PopupContent() {
  const { value: inputBalance, component: balanceField } =
    useAssetHubDotBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const { notePreimageTx } = useSpendDotOnAssetHubPreimageTx(
    inputBalance,
    beneficiary,
    validFrom,
  );

  return (
    <>
      <SignerWithBalance />
      {balanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>
          Please input an AssetHub address as the beneficiary
        </InfoMessage>
      </div>
      {validFromField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </>
  );
}

export default function SpendDotOnAssetHubPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Spend DOT on AssetHub" onClose={onClose}>
      <AssetHubApiProvider>
        <PopupContent />
      </AssetHubApiProvider>
    </Popup>
  );
}
