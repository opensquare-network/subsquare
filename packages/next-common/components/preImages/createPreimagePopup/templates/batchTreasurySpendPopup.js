import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo, useState } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { addressToPublicKey } from "next-common/utils/address";
import { InfoMessage } from "next-common/components/setting/styled";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import { MultiSymbolBalance } from "../fields/multiSymbolBalance";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";
import { TreasuryProvider } from "next-common/context/treasury";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import ValidFromField from "next-common/components/popup/fields/validFromField";
import { useMemorizer } from "next-common/utils/useMemorizer";
import SubtractIcon from "next-common/components/callTreeView/subtract";
import IconButton from "next-common/components/iconButton";
import PlusIcon from "next-common/components/callTreeView/plus";
import { useChainSettings } from "next-common/context/chain";

const getAssetKindParam = (assetId) => {
  return {
    V4: {
      location: {
        parents: 0,
        interior: "Here",
      },
      assetId: {
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
  };
};

const getNativeAssetKindParam = () => {
  return {
    V4: {
      location: {
        parents: 0,
        interior: "Here",
      },
      assetId: {
        parents: 1,
        interior: "Here",
      },
    },
  };
};

const getBeneficiaryParam = (beneficiary) => {
  return {
    V4: {
      location: {
        parents: 0,
        interior: "Here",
      },
      accountId: {
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
    },
  };
};

export function useBatchTreasurySpendsNotePreimageTx(spendInputs) {
  const api = useContextApi();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();

  return useMemo(() => {
    if (!api) {
      return {};
    }
    try {
      const spendTxs = spendInputs.map(
        ({ inputBalance, beneficiary, validFrom, symbol }) => {
          if (!inputBalance) {
            throw new Error("Invalid input balance");
          }
          if (!beneficiary) {
            throw new Error("Invalid beneficiary");
          }

          if (symbol === nativeSymbol) {
            const bnValue = checkInputValue(inputBalance, nativeDecimals);
            return api.tx.treasury.spend(
              getNativeAssetKindParam(),
              bnValue.toFixed(),
              getBeneficiaryParam(beneficiary),
              validFrom ? parseInt(validFrom) : null,
            );
          } else {
            const asset = getAssetBySymbol(symbol);
            if (!asset) {
              throw new Error("Invalid asset");
            }

            const bnValue = checkInputValue(inputBalance, asset.decimals);

            return api.tx.treasury.spend(
              getAssetKindParam(asset.id),
              bnValue.toFixed(),
              getBeneficiaryParam(beneficiary),
              validFrom ? parseInt(validFrom) : null,
            );
          }
        },
      );
      let proposal = spendTxs[0];
      if (spendTxs.length > 1) {
        proposal = api.tx.utility.batch(spendTxs);
      }
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, spendInputs, nativeSymbol, nativeDecimals]);
}

function RemovePayoutButton({ onClick }) {
  return (
    <IconButton onClick={onClick}>
      <SubtractIcon size={12} />
      Remove
    </IconButton>
  );
}

function AddPayoutButton({ onClick }) {
  return (
    <IconButton onClick={onClick}>
      <PlusIcon size={12} />
      Add Payout
    </IconButton>
  );
}

export function useBatchSpendInputs() {
  const [index, setIndex] = useState(1);
  const [spendInputs, setSpendInputs] = useState([
    {
      index: 0,
      inputBalance: "",
      beneficiary: "",
      validFrom: "",
      symbol: "USDT",
    },
  ]);
  const extensionAccounts = useExtensionAccounts();

  const addSpendInput = () => {
    setSpendInputs((inputs) => [
      ...inputs,
      {
        index,
        inputBalance: "",
        beneficiary: "",
        validFrom: "",
        symbol: "USDT",
      },
    ]);
    setIndex((prev) => prev + 1);
  };

  const removeSpendInput = (index) => {
    setSpendInputs((inputs) => inputs.filter(({ index: i }) => i !== index));
  };

  const updateSpendInput = (index, field, value) => {
    setSpendInputs((inputs) =>
      inputs.map((input) =>
        input.index === index ? { ...input, [field]: value } : input,
      ),
    );
  };

  const memorize = useMemorizer();

  const component = (
    <>
      {spendInputs.map((input) => (
        <TreasuryProvider key={input.index}>
          <div className="flex flex-col gap-4 border border-gray200 rounded-lg p-4 mb-4">
            <div className="flex flex-col gap-[8px]">
              <AddressComboField
                title="Beneficiary"
                defaultAddress={input["beneficiary"]}
                extensionAccounts={extensionAccounts}
                setAddress={memorize(
                  (value) =>
                    updateSpendInput(input.index, "beneficiary", value),
                  [input.index, "beneficiary"],
                )}
                placeholder="Please fill the address or select another one..."
                status={
                  spendInputs.length > 1 && (
                    <RemovePayoutButton
                      onClick={() => removeSpendInput(input.index)}
                    />
                  )
                }
              />
              <InfoMessage>
                Please input an AssetHub address as the beneficiary
              </InfoMessage>
            </div>
            <MultiSymbolBalance
              inputBalance={input["inputBalance"]}
              setInputBalance={memorize(
                (value) => updateSpendInput(input.index, "inputBalance", value),
                [input.index, "inputBalance"],
              )}
              symbol={input["symbol"]}
              setSymbol={memorize(
                (value) => updateSpendInput(input.index, "symbol", value),
                [input.index, "symbol"],
              )}
            />
            <ValidFromField
              title="Valid From"
              value={input["validFrom"]}
              setValue={memorize(
                (value) => updateSpendInput(input.index, "validFrom", value),
                [input.index, "validFrom"],
              )}
            />
          </div>
        </TreasuryProvider>
      ))}
      <div className="flex justify-end">
        <AddPayoutButton onClick={addSpendInput} />
      </div>
    </>
  );
  return {
    spendInputs,
    component,
  };
}

function BatchTreasurySpendPopupContent() {
  const { spendInputs, component: batchSpendInputsComponent } =
    useBatchSpendInputs();

  const { encodedHash, encodedProposal, encodedLength, notePreimageTx } =
    useBatchTreasurySpendsNotePreimageTx(spendInputs);

  return (
    <>
      <SignerWithBalance />
      {batchSpendInputsComponent}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      <InsufficientBalanceTips byteLength={encodedLength} onlyPreimage />
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </>
  );
}

export default function BatchTreasurySpendPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create Multi-Spends Treasury Proposal" onClose={onClose}>
      <BatchTreasurySpendPopupContent />
    </Popup>
  );
}
