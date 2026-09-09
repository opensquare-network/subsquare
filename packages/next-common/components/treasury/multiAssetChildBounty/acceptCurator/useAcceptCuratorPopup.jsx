import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupLabel from "next-common/components/popup/label";
import Loading from "next-common/components/loading";
import { InfoMessage } from "next-common/components/setting/styled";
import Tooltip from "next-common/components/tooltip";
import CurrencyInput from "next-common/components/currencyInput";
import { useState } from "react";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { getEventData } from "next-common/utils/sendTransaction";
import { toPrecision } from "next-common/utils";
import BigNumber from "bignumber.js";
import {
  UseConnectedAccountSigner,
  useCuratorDeposit,
} from "next-common/components/treasury/multiAssetBounty/acceptCurator/useAcceptCuratorPopup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { wrapTxByRole } from "next-common/utils/sendTransaction/wrapTxByRole";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";

function PopupContent({ origin, role }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
  const { parentBountyId, childBountyId } = useOnchainData();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();

  // Same curator deposit calculation as the parent bounty accept: the runtime
  // freezes a NATIVE-token deposit computed from the child value via the
  // AssetRate (multiplier 50%, clamp 10~200 DOT on Asset Hub). Sharing the
  // parent hook keeps the two popups consistent.
  const {
    deposit,
    isLoading: depositLoading,
    unavailable,
  } = useCuratorDeposit();

  // The deposit is held on the origin (curator) account, so check that
  // account's native transferable balance (for a multisig origin this is the
  // multisig account itself).
  const { value: originBalanceInfo, loading: originBalanceLoading } =
    useSubBalanceInfo(origin, api);
  const originTransferable = originBalanceInfo?.transferrable;

  const depositReady = !!deposit && !depositLoading && !unavailable;

  // Balance pre-check must fail closed, not open: while the curator balance is
  // still loading we cannot prove the deposit is covered, so submission stays
  // disabled. A missing balance entry after load means the account holds no
  // free balance (transferable 0), so it cannot cover the deposit either.
  const balanceLoading = originBalanceLoading;
  const originFreeBalance =
    originTransferable == null
      ? new BigNumber(0)
      : new BigNumber(originTransferable);
  const insufficientBalance =
    depositReady &&
    !balanceLoading &&
    new BigNumber(deposit).gt(originFreeBalance);

  // Single source of truth for why Confirm is disabled; submitReady is derived
  // from it so the two never drift apart.
  let tooltipContent = null;
  if (!depositReady) {
    tooltipContent = unavailable
      ? "Unable to compute the curator deposit"
      : "Curator deposit is loading";
  } else if (balanceLoading) {
    tooltipContent = "Checking curator balance";
  } else if (insufficientBalance) {
    tooltipContent = "Insufficient native balance for the curator deposit";
  }
  const submitReady = !tooltipContent;

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!depositReady) {
        toastError(
          unavailable
            ? "Unable to compute the curator deposit"
            : "Curator deposit is loading",
        );
        return null;
      }
      if (balanceLoading) {
        toastError("Curator balance is loading");
        return null;
      }
      if (insufficientBalance) {
        toastError("Insufficient native balance for the curator deposit");
        return null;
      }

      const txApi = api?.tx?.multiAssetBounties;
      if (!txApi?.acceptCurator) {
        toastError("Accept curator transaction is unavailable");
        return null;
      }

      const tx = txApi.acceptCurator(parentBountyId, childBountyId);
      return wrapTxByRole(api, { role, tx, connectedAddress, origin });
    },
    [
      api,
      role,
      connectedAddress,
      origin,
      parentBountyId,
      childBountyId,
      depositReady,
      deposit,
      unavailable,
      balanceLoading,
      insufficientBalance,
    ],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      <PopupLabel text="Curator Deposit" />
      {depositLoading ? (
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
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <Tooltip content={tooltipContent}>
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFuncForSubmit}
          disabled={!submitReady}
          onInBlock={({ events }) => {
            if (
              role?.kind === "multisig" &&
              getEventData(events, "multisig", "NewMultisig")
            ) {
              dispatch(
                newSuccessToast(
                  "Multisig transaction submitted. Waiting for other signatories.",
                ),
              );
            }
          }}
        />
      </Tooltip>
    </>
  );
}

function AcceptCuratorPopup({ origin, role, ...props }) {
  return (
    <PopupWithSigner title="Accept Curator" {...props}>
      <PopupContent origin={origin} role={role} />
    </PopupWithSigner>
  );
}

export default function useAcceptCuratorPopup(origin) {
  const [openRole, setOpenRole] = useState(null);

  return {
    showPopup: setOpenRole,
    popup: openRole ? (
      <AcceptCuratorPopup
        origin={origin}
        role={openRole}
        onClose={() => setOpenRole(null)}
      />
    ) : null,
  };
}
