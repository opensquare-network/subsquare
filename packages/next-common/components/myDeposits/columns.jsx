import { SystemClose } from "@osn/icons/subsquare";
import isNil from "lodash.isnil";
import GhostButton from "next-common/components/buttons/ghostButton";
import ListPostTitle from "next-common/components/postList/postTitle";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import dynamic from "next/dynamic";
import { useState } from "react";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";

const SubmissionDepositRefundPopup = dynamic(
  () =>
    import(
      "next-common/components/gov2/referendum/metadata/submissionDepositRefund/popup"
    ),
  { ssr: false },
);

const DecisionDepositRefundPopup = dynamic(
  () =>
    import(
      "next-common/components/gov2/referendum/metadata/decisionDepositRefund/popup"
    ),
  { ssr: false },
);

export function getSubmissionDepositRefundColumn({ pallet } = {}) {
  return {
    name: "",
    className: "w-20 text-right",
    cellRender(data) {
      const { referendumIndex } = data;

      return (
        <SubmissionDepositRefundButton
          pallet={pallet}
          referendumIndex={referendumIndex}
        />
      );
    },
  };
}

function SubmissionDepositRefundButton({ pallet, referendumIndex }) {
  const [showPopup, setShowPopup] = useState(false);
  const info = useSubReferendumInfo(pallet, referendumIndex);

  let disabled = true;
  const { approved, cancelled } = info || {};
  const [, deposit] = approved || cancelled || [];

  if (deposit) {
    disabled = false;
  }

  let tooltip = disabled
    ? "Can be refunded if approved or cancelled"
    : "Refund";

  return (
    <>
      <Tooltip content={tooltip}>
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
      </Tooltip>

      {showPopup && (
        <SubmissionDepositRefundPopup
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
        <DecisionDepositRefundButton
          pallet={pallet}
          referendumIndex={referendumIndex}
        />
      );
    },
  };
}

function DecisionDepositRefundButton({ pallet, referendumIndex }) {
  const [showPopup, setShowPopup] = useState(false);
  const info = useSubReferendumInfo(pallet, referendumIndex);

  let disabled = true;
  const { approved, rejected, timedOut, cancelled, ongoing } = info || {};
  const [, , deposit] = approved || rejected || timedOut || cancelled || [];

  if (deposit) {
    disabled = false;
  }

  const tooltip = ongoing ? "Still under decision" : "Refund";

  return (
    <>
      <Tooltip content={tooltip}>
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
      </Tooltip>

      {showPopup && (
        <DecisionDepositRefundPopup
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
      const bond = data.curatorDeposit || data.bond;

      if (isNil(bond)) {
        return "--";
      }

      return (
        <ValueDisplay
          className="text14Medium text-textPrimary"
          value={toPrecision(bond, decimals)}
          symbol={symbol}
        />
      );
    },
  };
}
