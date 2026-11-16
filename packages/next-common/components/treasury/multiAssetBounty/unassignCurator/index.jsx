import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SplitRoleMenuButton from "next-common/components/splitRoleMenuButton";
import Link from "next-common/components/link";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { InfoMessage } from "next-common/components/setting/styled";
import NumberWithComma from "next-common/components/numberWithComma";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import useAccountRole from "next-common/hooks/accountAuthority/useAccountRole";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils/isSameAddress";
import { toPrecision } from "next-common/utils";
import { wrapTxByRole } from "next-common/utils/sendTransaction/wrapTxByRole";
import { findPendingMultisig } from "next-common/utils/sendTransaction/findPendingMultisig";
import { getEventData } from "next-common/utils/sendTransaction";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { UseConnectedAccountSigner } from "../acceptCurator/useAcceptCuratorPopup";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import useMultiAssetChildBountyStatus from "../../multiAssetChildBounty/useMultiAssetChildBountyStatus";
import { getCuratorDeposit, getUnassignAction } from "./actions";

function usePendingUnassign(parentId, childId, origin, authority) {
  const api = useContextApi();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    setAddresses([]);
    if (
      !api?.tx?.multiAssetBounties?.unassignCurator ||
      parentId == null ||
      !origin
    ) {
      return;
    }

    let cancelled = false;
    const tx = api.tx.multiAssetBounties.unassignCurator(parentId, childId);
    findPendingMultisig(api, tx, origin, authority)
      .then((found) => {
        if (!cancelled) {
          setAddresses(found);
        }
      })
      .catch((error) => console.error(error));
    return () => {
      cancelled = true;
    };
  }, [api, parentId, childId, origin, authority]);

  return addresses;
}

function PopupContent({ action, role, parentId, childId }) {
  const api = useContextApi();
  const dispatch = useDispatch();
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
  const [deposit, setDeposit] = useState(null);
  const [depositError, setDepositError] = useState(false);

  useEffect(() => {
    if (!action.depositEffect) {
      return;
    }
    setDeposit(null);
    setDepositError(false);
    if (!api?.query?.multiAssetBounties?.curatorDeposit) {
      setDepositError(true);
      return;
    }

    let cancelled = false;
    api.query.multiAssetBounties
      .curatorDeposit(parentId, childId)
      .then((option) => {
        const amount = getCuratorDeposit(option);
        if (!cancelled) {
          setDeposit(amount);
        }
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) {
          setDepositError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [api, action.depositEffect, parentId, childId]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api?.tx?.multiAssetBounties?.unassignCurator) {
        toastError("Unassign curator transaction is unavailable");
        return null;
      }
      const tx = api.tx.multiAssetBounties.unassignCurator(parentId, childId);
      return wrapTxByRole(api, {
        role,
        tx,
        connectedAddress,
        origin: action.origin,
      });
    },
    [api, role, connectedAddress, action.origin, parentId, childId],
  );

  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      <InfoMessage>
        {action.depositEffect ? (
          depositError ? (
            "Unable to load the curator deposit. Close and reopen this dialog to retry."
          ) : deposit === null ? (
            "Loading curator deposit..."
          ) : (
            <>
              The curator deposit of&nbsp;
              <NumberWithComma
                value={toPrecision(deposit, decimals)}
                symbol={symbol}
              />
              &nbsp; will be {action.depositEffect}.
            </>
          )
        ) : (
          "The proposed curator has not made a deposit."
        )}
      </InfoMessage>
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton
        title="Confirm"
        disabled={!!action.depositEffect && (deposit === null || depositError)}
        getTxFunc={getTxFuncForSubmit}
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
    </>
  );
}

export default function UnassignCurator({ isChild = false, phase, remove }) {
  const address = useRealAddress();
  const { bountyIndex, parentBountyId, childBountyId } = useOnchainData();
  const parentId = isChild ? parentBountyId : bountyIndex;
  const childId = isChild ? childBountyId : null;
  const parentStatus = useMultiAssetBountyStatus(parentId);
  const childStatus = useMultiAssetChildBountyStatus(
    isChild ? parentId : null,
    childId,
  );
  const status = isChild ? childStatus : parentStatus;
  const action = getUnassignAction({ status, parentStatus, isChild, remove });
  const origin = status?.type === phase ? action?.origin : null;
  const { roles, authority, loading } = useAccountRole(origin);
  const pending = usePendingUnassign(parentId, childId, origin, authority);
  const [role, setRole] = useState(null);

  if (!address || !origin || loading || roles.length === 0) {
    return null;
  }

  const canManagePending = pending.some((pendingAddress) =>
    roles.some(
      (item) =>
        item.kind === "multisig" &&
        isSameAddress(item.multisig?.multisigAddress, pendingAddress),
    ),
  );

  return (
    <div className="w-full">
      <SplitRoleMenuButton
        fullWidth
        action={action.label}
        roles={roles}
        onClick={setRole}
      />
      {pending.length > 0 && (
        <div className="text-textSecondary text14Medium mt-2">
          There is an ongoing multisig about this bounty.
          {canManagePending && (
            <>
              {" "}
              <Link className="underline" href="/account/multisigs">
                Manage it here
              </Link>
            </>
          )}
        </div>
      )}
      {role && (
        <PopupWithSigner title={action.label} onClose={() => setRole(null)}>
          <PopupContent
            action={action}
            role={role}
            parentId={parentId}
            childId={childId}
          />
        </PopupWithSigner>
      )}
    </div>
  );
}
