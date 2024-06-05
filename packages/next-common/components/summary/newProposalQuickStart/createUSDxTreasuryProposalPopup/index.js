import AddressComboField from "next-common/components/popup/fields/addressComboField";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo, useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { checkInputValue } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import USDxBalanceField from "next-common/components/popup/fields/usdxBalanceField";
import { addressToPublicKey } from "next-common/utils/address";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "../common/advanceSettings";
import BlocksField from "next-common/components/popup/fields/blocksField";
import TreasuryBalance from "./treasuryBalance";
import useAssetHubTreasuryBalance, {
  StatemintAssets,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import BigNumber from "bignumber.js";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";
import Popup from "next-common/components/popup/wrapper/Popup";

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

export function NewUSDxTreasuryReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { tracks } = usePageProps();
  const api = useContextApi();
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = useTrackDetail(trackId);
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const [enactment, setEnactment] = useState();
  const [symbol, setSymbol] = useState("USDt");
  const [validFrom, setValidFrom] = useState("");

  const { balance: treasuryBalance, loading: isTreasuryBalanceLoading } =
    useAssetHubTreasuryBalance(symbol);

  // 1 DOT = 10 USDx
  const nativeTokenPrice = 10;
  const tokenAmount = new BigNumber(inputBalance)
    .div(nativeTokenPrice)
    .toNumber();

  const { encodedHash, encodedLength, notePreimageTx } = useMemo(() => {
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

  return (
    <Popup title="Create USDx Treasury Proposal" onClose={onClose} wide>
      <AssetHubApiProvider>
        <SignerWithBalance title="Origin" />
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
      </AssetHubApiProvider>
    </Popup>
  );
}
