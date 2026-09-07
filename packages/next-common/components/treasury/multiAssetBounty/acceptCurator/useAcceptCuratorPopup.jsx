import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupLabel from "next-common/components/popup/label";
import Loading from "next-common/components/loading";
import { InfoMessage } from "next-common/components/setting/styled";
import CurrencyInput from "next-common/components/currencyInput";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useCallback, useEffect, useMemo, useState } from "react";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

// FixedU128 accuracy (10^18) used by AssetRate.conversionRateToNative.
const fixedU128Accuracy = new BigNumber(10).pow(18);

// On Asset Hubs the multi-asset-bounties curator deposit config shares the
// same parameter_types as the pallet-bounties constants (verified on-chain:
// multiplier 500000 Permill = 50%, min 10 DOLLARS, max 200 DOLLARS).
const FALLBACK_CURATOR_DEPOSIT_MULTIPLIER_PERMILL = 500000;
const FALLBACK_CURATOR_DEPOSIT_MIN_DOLLARS = 10;
const FALLBACK_CURATOR_DEPOSIT_MAX_DOLLARS = 200;

export function useAcceptCuratorPopup(bountyIndex) {
  const [isOpen, setIsOpen] = useState(false);

  const component = isOpen && (
    <AcceptCuratorPopup
      bountyIndex={bountyIndex}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );

  return {
    component,
    showPopupFn() {
      setIsOpen(true);
    },
  };
}

// Reproduce pallet-multi-asset-bounties accept_curator deposit calculation:
//   1. native_amount = BalanceConverter::from_asset_balance(bounty.value, asset_kind)
//        = floor(bounty.value * conversionRateToNative / 10^18) when an asset rate
//          exists, otherwise the asset is treated as native (identity, rate = 1)
//   2. deposit = clamp(floor(native_amount * CuratorDepositMultiplier), min, max)
//   3. The deposit is held in the NATIVE token (e.g. DOT), not the bounty asset.
function useCuratorDeposit() {
  const { assetKind, value } = useOnchainData();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const api = useConditionalContextApi();

  const [config, setConfig] = useState(null);
  const [rate, setRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    const consts = api.consts?.bounties;
    setConfig({
      multiplierPermill:
        consts?.curatorDepositMultiplier?.toJSON?.() ??
        FALLBACK_CURATOR_DEPOSIT_MULTIPLIER_PERMILL,
      min: consts?.curatorDepositMin?.toJSON?.() ?? null,
      max: consts?.curatorDepositMax?.toJSON?.() ?? null,
    });
  }, [api]);

  useEffect(() => {
    if (!api || !assetKind) {
      setIsLoading(false);
      return;
    }

    const rateQuery = api.query?.assetRate?.conversionRateToNative;
    if (!rateQuery) {
      setRate(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    rateQuery(assetKind)
      .then((option) =>
        setRate(option?.isSome ? option.unwrap().toString() : null),
      )
      .catch(() => setRate(null))
      .finally(() => setIsLoading(false));
  }, [api, assetKind]);

  const assetInfo = useMemo(
    () => getAssetInfoFromAssetKind(assetKind, nativeDecimals, nativeSymbol),
    [assetKind, nativeDecimals, nativeSymbol],
  );

  const { deposit, min, max } = useMemo(() => {
    if (!config || value == null) {
      return { deposit: null, min: null, max: null };
    }

    const one = new BigNumber(10).pow(nativeDecimals);
    const minBalance =
      config.min != null
        ? new BigNumber(config.min)
        : new BigNumber(FALLBACK_CURATOR_DEPOSIT_MIN_DOLLARS).times(one);
    const maxBalance =
      config.max != null
        ? new BigNumber(config.max)
        : new BigNumber(FALLBACK_CURATOR_DEPOSIT_MAX_DOLLARS).times(one);

    let nativeBalance = new BigNumber(value);
    if (rate) {
      nativeBalance = nativeBalance
        .times(new BigNumber(rate))
        .dividedBy(fixedU128Accuracy)
        .integerValue(BigNumber.ROUND_FLOOR);
    }

    let depositBalance = nativeBalance
      .times(config.multiplierPermill)
      .dividedBy(1_000_000)
      .integerValue(BigNumber.ROUND_FLOOR);

    if (depositBalance.lt(minBalance)) {
      depositBalance = minBalance;
    }
    if (depositBalance.gt(maxBalance)) {
      depositBalance = maxBalance;
    }

    return { deposit: depositBalance, min: minBalance, max: maxBalance };
  }, [config, rate, value, nativeDecimals]);

  return { assetInfo, value, deposit, min, max, isLoading };
}

function PopupContent({ bountyIndex }) {
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const { deposit, isLoading } = useCuratorDeposit();
  const api = useConditionalContextApi();

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.multiAssetBounties?.acceptCurator) {
      return null;
    }

    // accept_curator(parent_bounty_id, child_bounty_id)
    // child_bounty_id is null for a parent bounty.
    return api.tx.multiAssetBounties.acceptCurator(bountyIndex, null);
  }, [api, bountyIndex]);

  const depositReady = deposit && !isLoading;

  return (
    <>
      <SignerWithBalance />
      <PopupLabel text="Curator Deposit" />
      {!depositReady ? (
        <InfoMessage className="justify-center min-h-[38px]">
          <Loading size={20} />
        </InfoMessage>
      ) : (
        <CurrencyInput
          disabled
          value={toPrecision(deposit, nativeDecimals)}
          symbol={nativeSymbol}
        />
      )}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton title="Confirm" getTxFunc={getTxFunc} />
      </div>
    </>
  );
}

function AcceptCuratorPopup({ bountyIndex, onClose }) {
  return (
    <PopupWithSigner title="Accept Curator" onClose={onClose}>
      <PopupContent bountyIndex={bountyIndex} />
    </PopupWithSigner>
  );
}
