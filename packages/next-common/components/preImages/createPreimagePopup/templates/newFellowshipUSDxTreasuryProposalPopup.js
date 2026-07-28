import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { addressToPublicKey } from "next-common/utils/address";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import useUSDxBalanceField from "../fields/useUSDxBalanceField";
import useAddressComboField from "../fields/useAddressComboField";
import useValidFromField from "../fields/useValidFromField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

const getAssetKindParam = (asset) => {
  if (asset.type === "foreignAsset") {
    return {
      V5: {
        location: {
          parents: 1,
          interior: {
            X1: [
              {
                Parachain: 1000,
              },
            ],
          },
        },
        assetId: asset.multiLocation,
      },
    };
  }

  return {
    V5: {
      location: {
        parents: 1,
        interior: {
          X1: [
            {
              Parachain: 1000,
            },
          ],
        },
      },
      assetId: {
        parents: 0,
        interior: {
          X2: [
            {
              PalletInstance: 50,
            },
            {
              GeneralIndex: asset.id,
            },
          ],
        },
      },
    },
  };
};

const getBeneficiaryParam = (beneficiary) => {
  return {
    V5: {
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

export function useFellowshipUSDxTreasuryNotePreimageTx(
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
    } catch {
      return {};
    }

    try {
      const proposal = api.tx.fellowshipTreasury.spend(
        getAssetKindParam(asset),
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

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useFellowshipUSDxTreasuryNotePreimageTx(
      inputBalance,
      beneficiary,
      validFrom,
      symbol,
    );

  return (
    <>
      <SignerWithBalance />
      {usdxBalanceField}
      <div className="flex flex-col gap-[8px]">{beneficiaryField}</div>
      {validFromField}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      <InsufficientBalanceTips byteLength={encodedLength} preimageOnly />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={() => notePreimageTx} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </>
  );
}

export default function NewFellowshipUSDxTreasuryProposalPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create USDx Treasury Proposal" onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
