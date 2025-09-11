import { has } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";

export default function FellowshipSalaryMemberStatus({ status }) {
  const { decimals, symbol } = getSalaryAsset();

  let content = <span className="text-textTertiary">-</span>;
  let tooltipContent;

  if (has(status, "attempted")) {
    if (status.attempted?.amount) {
      tooltipContent = `${toPrecision(
        status.attempted.amount || 0,
        decimals,
      )} ${symbol}`;
    }
    content = <span className="text-green500">Paid</span>;
  } else if (has(status, "registered")) {
    tooltipContent = `${toPrecision(status.registered, decimals)} ${symbol}`;
    content = <span className="text-blue500">Registered</span>;
  } else if (has(status, "nothing")) {
    content = <span className="text-textTertiary">Nothing</span>;
  }

  return <Tooltip content={tooltipContent}>{content}</Tooltip>;
}
