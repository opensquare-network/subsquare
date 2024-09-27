import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { addressToPublicKey } from "next-common/utils/address";
import { InfoMessage } from "next-common/components/setting/styled";
import { StatemintAssets } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { AssetHubProvider } from "next-common/context/assetHub";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "./notePreimageButton";
import useUSDxBalanceField from "./fields/useUSDxBalanceField";
import useAddressComboField from "./fields/useAddressComboField";
import useValidFromField from "./fields/useValidFromField";

const getAssetKindParam = (assetId) => {
  return {
    V3: {
      location: {
        parents: 0,
        interior: {
          X1: {
            Parachain: 1000,
          },
        },
      },
      assetId: {
        Concrete: {
          parents: 0,
          interior: {
            X2: [
              {
                PalletInstance: 50,
              },
              {
                GeneralIndex: assetId,
              },
            ],
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

const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export function useUSDxTreasuryNotePreimageTx(
  inputBalance,
  beneficiary,
  validFrom,
  symbol,
) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || !inputBalance || !beneficiary) {
      return {};
    }

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      throw new Error("Invalid asset");
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputBalance, asset.decimals);
    } catch (err) {
      return {};
    }

    try {
      const proposal = api.tx.treasury.spend(
        getAssetKindParam(asset.id),
        bnValue.toFixed(),
        getBeneficiaryParam(beneficiary),
        validFrom ? parseInt(validFrom) : null,
      );

      return getState(api, proposal);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [api, inputBalance, beneficiary, validFrom, symbol]);
}

function PopupContent() {
  const {
    value: [inputBalance, symbol],
    component: usdxBalanceField,
  } = useUSDxBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const { notePreimageTx } = useUSDxTreasuryNotePreimageTx(
    inputBalance,
    beneficiary,
    validFrom,
    symbol,
  );

  return (
    <>
      <SignerWithBalance title="Origin" />
      {usdxBalanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>Please fill the address from AssetHub</InfoMessage>
      </div>
      {validFromField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </>
  );
}

export default function NewUSDxTreasuryProposalPopup({ onClose }) {
  return (
    <Popup
      title="Create USDx Treasury Proposal"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <AssetHubProvider>
        <PopupContent />
      </AssetHubProvider>
    </Popup>
  );
}
