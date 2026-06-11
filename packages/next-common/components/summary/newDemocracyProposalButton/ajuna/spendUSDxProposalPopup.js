import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithVotingBalance from "next-common/components/signerPopup/signerWithVotingBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { checkInputValue, toPrecision } from "next-common/utils";
import {
  DemocracyProposeTxSubmissionButton,
  useDemocracyProposeTxFunc,
} from "../common/democracyProposeTxSubmissionButton";
import SubmissionDeposit from "../common/submissionDeposit";
import EstimatedGas from "next-common/components/estimatedGas";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { TreasuryBalance } from "next-common/components/preImages/createPreimagePopup/fields/useUSDxBalanceField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import { useTreasuryAccount } from "next-common/utils/hooks/useTreasuryFree";
import USDxBalanceField from "next-common/components/popup/fields/usdxBalanceField";
import { TreasuryProvider } from "next-common/context/treasury";
import { isNil } from "lodash-es";

function useAjunaAssetAccount(assetId, address) {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!api || isNil(assetId) || !address) {
      return;
    }

    setIsLoading(true);
    api.query.assets.account(assetId, address).then((account) => {
      setAccount(account);
      setIsLoading(false);
    });
  }, [api, assetId, address]);

  return {
    account,
    isLoading,
  };
}

function useAjunaAssetMetadata(assetId) {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!api || isNil(assetId)) {
      return;
    }

    setIsLoading(true);
    api.query.assets.metadata(assetId).then((metadata) => {
      setMetadata(metadata);
      setIsLoading(false);
    });
  }, [api, assetId]);

  return {
    metadata,
    isLoading,
  };
}

function useAjunaTreasuryBalance(symbol) {
  const api = useContextApi();
  const asset = getAssetBySymbol(symbol);
  const treasuryAccount = useTreasuryAccount(api);
  const { account, isLoading: isAccountLoading } = useAjunaAssetAccount(
    asset?.id,
    treasuryAccount,
  );
  const { metadata, isLoading: isMetadataLoading } = useAjunaAssetMetadata(
    asset?.id,
  );

  const loading = isAccountLoading || isMetadataLoading;

  if (loading) {
    return {
      balance: null,
      decimals: null,
      loading: true,
    };
  }

  const balance = account?.toJSON()?.balance?.toNumber() || 0;
  const decimals = metadata?.decimals?.toNumber();

  return {
    balance,
    decimals,
    loading: false,
  };
}

function USDxBalance({ inputBalance, setInputBalance, symbol, setSymbol }) {
  const {
    balance: treasuryBalance,
    decimals: treasuryBalanceDecimals,
    loading: isTreasuryBalanceLoading,
  } = useAjunaTreasuryBalance(symbol);

  const status = isTreasuryBalanceLoading ? (
    <TreasuryBalance isLoading={isTreasuryBalanceLoading} symbol={symbol} />
  ) : (
    <TreasuryBalance
      isLoading={isTreasuryBalanceLoading}
      symbol={symbol}
      treasuryBalance={toPrecision(treasuryBalance, treasuryBalanceDecimals)}
    />
  );

  return (
    <USDxBalanceField
      title="Request"
      inputBalance={inputBalance}
      setInputBalance={setInputBalance}
      symbol={symbol}
      setSymbol={setSymbol}
      status={status}
    />
  );
}

export default function AjunaSpendUSDxProposalPopup() {
  const api = useContextApi();
  const { onClose } = usePopupParams();
  const [inputBalance, setInputBalance] = useState("");
  const [symbol, setSymbol] = useState("USDT");
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const getTxFunc = useCallback(() => {
    if (!api) {
      throw new Error("Chain network is not connected yet");
    }

    if (!inputBalance) {
      throw new Error("Request balance is required");
    }

    if (!beneficiary) {
      throw new Error("Beneficiary address is required");
    }

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      throw new Error(`Invalid asset type: ${symbol}`);
    }

    const bnValue = checkInputValue(
      inputBalance,
      asset.decimals,
      "Request balance",
      false,
    );

    return api.tx.treasury.spend(
      {
        WithId: asset.id,
      },
      bnValue.toFixed(),
      beneficiary,
      validFrom ? parseInt(validFrom) : null,
    );
  }, [api, symbol, inputBalance, beneficiary, validFrom]);
  const getProposeTxFunc = useDemocracyProposeTxFunc(getTxFunc);

  return (
    <TreasuryProvider>
      <Popup title="Spend treasury USDx token" onClose={onClose}>
        <SignerWithVotingBalance />
        <USDxBalance
          inputBalance={inputBalance}
          setInputBalance={setInputBalance}
          symbol={symbol}
          setSymbol={setSymbol}
        />
        {beneficiaryField}
        <AdvanceSettings>
          {validFromField}
          <SubmissionDeposit />
          <EstimatedGas getTxFunc={getProposeTxFunc} />
        </AdvanceSettings>
        <div className="flex justify-end">
          <DemocracyProposeTxSubmissionButton getTxFunc={getTxFunc} />
        </div>
      </Popup>
    </TreasuryProvider>
  );
}
