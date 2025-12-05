import { isNil } from "lodash-es";
import ListPostTitle from "next-common/components/postList/postTitle";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { useState } from "react";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";
import MyDepositUndoButton from "./undoButton";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SubmissionDepositRefundPopup = dynamicPopup(() =>
  import(
    "next-common/components/gov2/referendum/metadata/submissionDepositRefund/popup"
  ),
);

const DecisionDepositRefundPopup = dynamicPopup(() =>
  import(
    "next-common/components/gov2/referendum/metadata/decisionDepositRefund/popup"
  ),
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
    ? "Can only be refunded if approved or cancelled"
    : "Refund";

  return (
    <>
      <Tooltip content={tooltip}>
        <MyDepositUndoButton
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        />
      </Tooltip>

      {showPopup && (
        <SubmissionDepositRefundPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          deposit={deposit}
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
        <MyDepositUndoButton
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        />
      </Tooltip>

      {showPopup && (
        <DecisionDepositRefundPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          deposit={deposit}
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
