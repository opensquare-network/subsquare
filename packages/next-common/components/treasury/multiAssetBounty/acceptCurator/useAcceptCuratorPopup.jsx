import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupLabel from "next-common/components/popup/label";
import Loading from "next-common/components/loading";
import { InfoMessage } from "next-common/components/setting/styled";
import CurrencyInput from "next-common/components/currencyInput";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMount } from "react-use";
import {
  useSignerAccount,
  useSignerContext,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import {
  ASSET_TYPE,
  getAssetInfoFromAssetKind,
} from "next-common/utils/treasury/multiAssetBounty/assetKind";
import { wrapTxByRole } from "next-common/utils/sendTransaction/wrapTxByRole";

// FixedU128 accuracy (10^18) used by AssetRate.conversionRateToNative.
const fixedU128Accuracy = new BigNumber(10).pow(18);

// On Asset Hubs the multi-asset-bounties curator deposit config shares the
// same parameter_types as the pallet-bounties constants (verified on-chain:
// multiplier 500000 Permill = 50%, min 10 DOLLARS, max 200 DOLLARS).
const FALLBACK_CURATOR_DEPOSIT_MULTIPLIER_PERMILL = 500000;
const FALLBACK_CURATOR_DEPOSIT_MIN_DOLLARS = 10;
const FALLBACK_CURATOR_DEPOSIT_MAX_DOLLARS = 200;

export function useAcceptCuratorPopup(bountyIndex, curator, role) {
  const [isOpen, setIsOpen] = useState(false);

  const component = isOpen && (
    <AcceptCuratorPopup
      bountyIndex={bountyIndex}
      curator={curator}
      role={role}
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
//        - for the chain's NATIVE token the runtime uses identity (rate = 1)
//        - for any other asset it requires AssetRate.conversionRateToNative;
//          without a rate accept_curator fails with FailedToConvertBalance,
//          so we must NOT fall back to 1:1 in that case
//   2. native_amount = floor(bounty.value * conversionRateToNative / 10^18)
//   3. deposit = clamp(floor(native_amount * CuratorDepositMultiplier), min, max)
//   4. The deposit is held in the NATIVE token (e.g. DOT), not the bounty asset.
function useCuratorDeposit() {
  const { assetKind, value } = useOnchainData();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const api = useConditionalContextApi();

  const [config, setConfig] = useState(null);
  const [rate, setRate] = useState(null);
  const [rateLoading, setRateLoading] = useState(true);

  const assetInfo = useMemo(
    () => getAssetInfoFromAssetKind(assetKind, nativeDecimals, nativeSymbol),
    [assetKind, nativeDecimals, nativeSymbol],
  );

  // Only the chain's own native token converts 1:1 (no rate lookup).
  // e.g. DOT on Asset Hub Polkadot. Anything else needs an AssetRate entry.
  const isNativeAsset = assetInfo?.assetType === ASSET_TYPE.native;

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
      setRateLoading(false);
      return;
    }

    // Native asset: the runtime converts with identity, no rate needed.
    if (isNativeAsset) {
      setRate(null);
      setRateLoading(false);
      return;
    }

    const rateQuery = api.query?.assetRate?.conversionRateToNative;
    if (!rateQuery) {
      setRate(null);
      setRateLoading(false);
      return;
    }

    setRateLoading(true);
    rateQuery(assetKind)
      .then((option) => {
        if (option?.isSome) {
          setRate(option.unwrap().toString());
        } else {
          // No rate set on-chain for this asset kind.
          setRate(null);
        }
      })
      .catch(() => {
        // RPC error: do not guess a rate; keep the deposit unknown.
        setRate(null);
      })
      .finally(() => setRateLoading(false));
  }, [api, assetKind, isNativeAsset]);

  const isLoading = !config || rateLoading;
  // Non-native asset with no usable rate: the chain itself would reject the
  // accept with FailedToConvertBalance, so we must not fabricate an amount.
  const unavailable = !isNativeAsset && !rate && !rateLoading;

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
    if (!isNativeAsset) {
      if (!rate) {
        // Conversion rate unavailable, cannot compute a reliable amount.
        return { deposit: null, min: minBalance, max: maxBalance };
      }
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
  }, [config, rate, value, nativeDecimals, isNativeAsset]);

  return { assetInfo, deposit, min, max, isLoading, unavailable };
}

// accept_curator is always dispatched as the curator itself, so the tx signer
// must be the connected account (the curator, or a multisig signatory who
// creates the multisig transaction). Drop any leftover proxy / multisig
// signer mode chosen elsewhere so the shared submission layer does not wrap
// the already-complete tx again.
function UseConnectedAccountSigner() {
  const { setSelectedProxyAddress, setMultisig } = useSignerContext();

  useMount(() => {
    setSelectedProxyAddress();
    setMultisig();
  });

  return null;
}

function PopupContent({ bountyIndex, curator, role }) {
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const { deposit, isLoading, unavailable } = useCuratorDeposit();
  const api = useConditionalContextApi();
  const signerAccount = useSignerAccount();

  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.multiAssetBounties?.acceptCurator) {
      return null;
    }

    // accept_curator(parent_bounty_id, child_bounty_id)
    // child_bounty_id is null for a parent bounty.
    const innerTx = api.tx.multiAssetBounties.acceptCurator(bountyIndex, null);

    return wrapTxByRole(api, {
      role,
      tx: innerTx,
      connectedAddress,
      origin: curator,
    });
  }, [api, bountyIndex, curator, role, connectedAddress]);

  const depositReady = deposit && !isLoading && !unavailable;

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      <PopupLabel text="Curator Deposit" />
      {isLoading ? (
        <InfoMessage className="justify-center min-h-9.5">
          <Loading size={20} />
        </InfoMessage>
      ) : unavailable ? (
        <InfoMessage className="min-h-9.5">
          Unable to compute the curator deposit
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
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          disabled={!depositReady}
        />
      </div>
    </>
  );
}

function AcceptCuratorPopup({ bountyIndex, curator, role, onClose }) {
  return (
    <PopupWithSigner title="Accept Curator" onClose={onClose}>
      <PopupContent bountyIndex={bountyIndex} curator={curator} role={role} />
    </PopupWithSigner>
  );
}
