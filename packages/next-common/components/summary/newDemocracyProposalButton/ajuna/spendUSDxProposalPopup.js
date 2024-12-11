import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithVotingBalance from "next-common/components/signerPopup/signerWithVotingBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { checkInputValue, toPrecision } from "next-common/utils";
import { DemocracyProposeTxSubmissionButton } from "../common/democracyProposeTxSubmissionButton";
import SubmissionDeposit from "../common/submissionDeposit";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { TreasuryBalance } from "next-common/components/preImages/createPreimagePopup/fields/useUSDxBalanceField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import { useTreasuryAccount } from "next-common/utils/hooks/useTreasuryFree";
import USDxBalanceField from "next-common/components/popup/fields/usdxBalanceField";
import { TreasuryProvider } from "next-common/context/treasury";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

function useAjunaTreasuryBalance(symbol) {
  const api = useContextApi();
  const asset = getAssetBySymbol(symbol);
  const treasuryAccount = useTreasuryAccount(api);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!api || !asset || !treasuryAccount) {
      return;
    }

    setIsBalanceLoading(true);
    api.query.assets.account(asset.id, treasuryAccount).then((account) => {
      setAccount(account);
      setIsBalanceLoading(false);
    });

    setIsMetadataLoading(true);
    api.query.assets.metadata(asset.id).then((metadata) => {
      setMetadata(metadata);
      setIsMetadataLoading(false);
    });
  }, [api, asset, treasuryAccount]);

  const balance = account?.toJSON()?.balance?.toNumber() || 0;
  const decimals = metadata?.decimals?.toNumber() || 0;
  const loading = isBalanceLoading || isMetadataLoading;

  return {
    balance,
    decimals,
    loading,
  };
}

function USDxBalance({ inputBalance, setInputBalance, symbol, setSymbol }) {
  const {
    balance: treasuryBalance,
    decimals: treasuryBalanceDecimals,
    loading: isTreasuryBalanceLoading,
  } = useAjunaTreasuryBalance(symbol);

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
          treasuryBalance={toPrecision(
            treasuryBalance,
            treasuryBalanceDecimals,
          )}
        />
      }
    />
  );
}

export default function AjunaSpendUSDxProposalPopup() {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { onClose } = usePopupParams();
  const [inputBalance, setInputBalance] = useState("");
  const [symbol, setSymbol] = useState("USDt");
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const getTxFunc = useCallback(() => {
    if (!api) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!inputBalance) {
      dispatch(newErrorToast("Request balance is required"));
      return;
    }

    if (!beneficiary) {
      dispatch(newErrorToast("Beneficiary address is required"));
      return;
    }

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      dispatch(newErrorToast(`Invalid asset type: ${symbol}`));
      return;
    }

    let bnValue;
    try {
      bnValue = checkInputValue(
        inputBalance,
        asset.decimals,
        "Request balance",
        false,
      );
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    return api.tx.treasury.spend(
      {
        WithId: asset.id,
      },
      bnValue.toFixed(),
      beneficiary,
      validFrom ? parseInt(validFrom) : null,
    );
  }, [dispatch, api, symbol, inputBalance, beneficiary, validFrom]);

  return (
    <TreasuryProvider>
      <Popup
        title="Spend treasury USDx token"
        className="!w-[640px]"
        onClose={onClose}
        wide
      >
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
        </AdvanceSettings>
        <div className="flex justify-end">
          <DemocracyProposeTxSubmissionButton getTxFunc={getTxFunc} />
        </div>
      </Popup>
    </TreasuryProvider>
  );
}
