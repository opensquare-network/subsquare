import AddressComboField from "next-common/components/popup/fields/addressComboField";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo, useState } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import USDxBalanceField from "next-common/components/popup/fields/usdxBalanceField";
import { addressToPublicKey } from "next-common/utils/address";
import { InfoMessage } from "next-common/components/setting/styled";
import BlocksField from "next-common/components/popup/fields/blocksField";
import TreasuryBalance from "./treasuryBalance";
import useAssetHubTreasuryBalance, {
  StatemintAssets,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

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

export function USDxBalance({
  inputBalance,
  setInputBalance,
  symbol,
  setSymbol,
}) {
  const { balance: treasuryBalance, loading: isTreasuryBalanceLoading } =
    useAssetHubTreasuryBalance(symbol);

  return (
    <USDxBalanceField
      title="Request"
      inputBalance={inputBalance}
      setInputBalance={setInputBalance}
      symbol={symbol}
      setSymbol={setSymbol}
      status={
        <TreasuryBalance
          isLoading={isTreasuryBalanceLoading}
          symbol={symbol}
          treasuryBalance={treasuryBalance}
        />
      }
    />
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const [symbol, setSymbol] = useState("USDt");
  const [validFrom, setValidFrom] = useState("");

  const { notePreimageTx } = useUSDxTreasuryNotePreimageTx(
    inputBalance,
    beneficiary,
    validFrom,
    symbol,
  );

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
      <BlocksField
        title="Valid From"
        value={validFrom}
        setValue={setValidFrom}
      />
      <div className="flex justify-end">
        <TxSubmissionButton
          getTxFunc={() => notePreimageTx}
          onClose={onClose}
        />
      </div>
    </>
  );
}

export default function NewUSDxTreasuryProposalPopup({ onClose }) {
  return (
    <Popup title="Create USDx Treasury Proposal" onClose={onClose} wide>
      <AssetHubApiProvider>
        <PopupContent />
      </AssetHubApiProvider>
    </Popup>
  );
}
