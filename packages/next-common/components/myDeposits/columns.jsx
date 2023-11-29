import { SystemClose } from "@osn/icons/subsquare";
import isNil from "lodash.isnil";
import GhostButton from "next-common/components/buttons/ghostButton";
import ListPostTitle from "next-common/components/postList/postTitle";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RefundPopup = dynamic(
  () => import("next-common/components/gov2/referendum/metadata/refund/popup"),
  { ssr: false },
);

export function getSubmissionDepositRefundColumn({ pallet } = {}) {
  return {
    name: "",
    className: "w-20 text-right",
    cellRender(data) {
      const { referendumIndex } = data;

      return (
        <Tooltip content="Refund">
          <SubmissionDepositRefundButton
            pallet={pallet}
            referendumIndex={referendumIndex}
          />
        </Tooltip>
      );
    },
  };
}

function SubmissionDepositRefundButton({ pallet, referendumIndex }) {
  const [showPopup, setShowPopup] = useState(false);
  // TODO: logic

  return (
    <>
      <GhostButton
        disabled // TODO: disabled
        className={cn(
          "group",
          "!p-1.5 !w-7 !h-7 !rounded !border-neutral400",
          "disabled:bg-neutral100",
        )}
        onClick={() => setShowPopup(true)}
      >
        <SystemClose
          className={cn(
            "w-4 h-4 [&_path]:stroke-textPrimary [&_path]:fill-textPrimary",
            "group-disabled:[&_path]:stroke-textDisabled group-disabled:[&_path]:fill-textDisabled",
          )}
        />
      </GhostButton>

      {showPopup && (
        <RefundPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export function getDecisionDepositRefundColumn({ pallet } = {}) {
  return {
    name: "",
    className: "w-20 text-right",
    cellRender(data) {
      const { referendumIndex } = data;

      return (
        <Tooltip content="Refund">
          <DecisionDepositRefundButton
            pallet={pallet}
            referendumIndex={referendumIndex}
          />
        </Tooltip>
      );
    },
  };
}

function DecisionDepositRefundButton({ pallet, referendumIndex }) {
  const [showPopup, setShowPopup] = useState(false);
  const api = useApi();
  const isMounted = useIsMounted();
  const [info, setInfo] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub;
    api.query[pallet].referendumInfoFor(referendumIndex, (optionalInfo) => {
      if (!isMounted.current || !optionalInfo.isSome) {
        return;
      }

      setInfo(optionalInfo.unwrap().toJSON());
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, referendumIndex]);

  let disabled = true;
  const { approved, rejected, timedOut, cancelled } = info || {};
  const [, , deposit] = approved || rejected || timedOut || cancelled || [];

  if (deposit) {
    disabled = false;
  }

  return (
    <>
      <GhostButton
        disabled={disabled}
        className={cn(
          "group",
          "!p-1.5 !w-7 !h-7 !rounded !border-neutral400",
          "disabled:bg-neutral100",
        )}
        onClick={() => setShowPopup(true)}
      >
        <SystemClose
          className={cn(
            "w-4 h-4 [&_path]:stroke-textPrimary [&_path]:fill-textPrimary",
            "group-disabled:[&_path]:stroke-textDisabled group-disabled:[&_path]:fill-textDisabled",
          )}
        />
      </GhostButton>

      {showPopup && (
        <RefundPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export function getDepositColumn({ decimals, symbol }) {
  return {
    name: "Deposit",
    className: "w-40 text-right",
    cellRender(data) {
      return (
        <ValueDisplay
          value={toPrecision(data.deposit, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}

export function getReasonPostTitleColumn() {
  return {
    name: "Reason",
    className: "text-left",
    cellRender(data) {
      return (
        <ListPostTitle
          className="line-clamp-1 mr-4 text14Medium"
          data={data}
          href={data.detailLink}
        />
      );
    },
  };
}

export function getBondBalanceColumn() {
  return {
    name: "Bond Balance",
    className: "w-40 text-right",
    cellRender(data) {
      const { decimals, symbol } = getChainSettings(CHAIN);

      const bond = data.bond;

      return !isNil(bond) ? (
        <ValueDisplay
          className="text14Medium text-textPrimary"
          value={toPrecision(bond, decimals)}
          symbol={symbol}
        />
      ) : (
        "--"
      );
    },
  };
}
