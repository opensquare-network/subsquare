import AddressComboField from "next-common/components/popup/fields/addressComboField";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { isNil } from "lodash-es";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
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
import useTreasuryBalance from "next-common/hooks/treasury/useTreasuryBalance";

const Assets = [
  {
    id: 1984,
    symbol: "USDt",
    decimals: 6,
  },
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
  },
];

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
  Assets.find((asset) => asset.symbol === symbol);

function PopupContent() {
  const { tracks, tracksDetail } = usePageProps();
  const api = useContextApi();
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = tracksDetail.find((track) => track.id === trackId);
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const [enactment, setEnactment] = useState();
  const { treasuryProposalTracks } = useChainSettings();
  const [symbol, setSymbol] = useState("USDt");
  const [validFrom, setValidFrom] = useState("");

  useEffect(() => {
    if (!treasuryProposalTracks || !inputBalance) {
      return;
    }
    const track = treasuryProposalTracks.find(
      (track) => isNil(track.max) || track.max >= parseFloat(inputBalance),
    );
    if (track) {
      setTrackId(track?.id);
    }
  }, [inputBalance, treasuryProposalTracks]);

  const { encodedHash, encodedLength, notePreimageTx } = useMemo(() => {
    if (!api || !inputBalance || !beneficiary) {
      return {};
    }

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      return {};
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

  const { balance: treasuryBalance, loading: isTreasuryBalanceLoading } =
    useTreasuryBalance();

  return (
    <>
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
            value={treasuryBalance}
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
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
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

export default function NewUSDxTreasuryReferendumPopup({ onClose }) {
  return (
    <PopupWithSigner title="USDx treasury proposal" onClose={onClose} wide>
      <PopupContent />
    </PopupWithSigner>
  );
}
