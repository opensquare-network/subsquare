import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { cn } from "next-common/utils";
import CancelRequestJudgement from "./cancelRequestJudgement";

const STATUS_THEME_MAP = {
  FeePaid: "text-theme500",
  KnownGood: "text-green500",
  Reasonable: "text-green500",
  OutOfDate: "text-orange500",
  LowQuality: "text-orange500",
  Erroneous: "text-red500",
  Unknown: "text-textTertiary",
};

function Registrar({ account, index }) {
  return (
    <div className="inline-flex space-x-2">
      <span className="text14Medium text-textPrimary">#{index} </span>
      <AddressUser key="user" add={account} />
    </div>
  );
}

function Status({ status, fee }) {
  const { symbol, decimals } = useChainSettings();

  return (
    <span
      className={cn(
        "text14Medium",
        STATUS_THEME_MAP[status] || "text-textPrimary",
      )}
    >
      {status}
      {status === "FeePaid" && (
        <span className="text-textTertiary ml-1">
          ({toPrecision(fee, decimals)}&nbsp;{symbol})
        </span>
      )}
    </span>
  );
}

function Action({ index, status }) {
  if (status !== "FeePaid") {
    return null;
  }

  return <CancelRequestJudgement registrarIndex={index} />;
}

const colRegistrar = {
  name: "Registrar",
  style: { textAlign: "left" },
  render: ({ account, index }) => <Registrar account={account} index={index} />,
};

const colStatus = {
  name: "Status",
  style: { textAlign: "right", minWidth: "160px" },
  render: ({ status, fee }) => <Status status={status} fee={fee} />,
};

const colAction = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: ({ index, status }) => <Action index={index} status={status} />,
};

export default [colRegistrar, colStatus, colAction];
