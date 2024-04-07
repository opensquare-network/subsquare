import { has } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export default function FellowshipSalaryMemberStatus({ status }) {
  const { decimals, symbol } = useSalaryAsset();

  let content = <span className="text-textTertiary">-</span>;
  let tooltipContent;

  if (has(status, "attempted")) {
    content = <span className="text-blue500">Attempted</span>;
  } else if (has(status, "registered")) {
    tooltipContent = `${toPrecision(status.registered, decimals)} ${symbol}`;
    content = <span className="text-green500">Registered</span>;
  } else if (has(status, "nothing")) {
    content = <span className="text-textTertiary">Nothing</span>;
  }

  return <Tooltip content={tooltipContent}>{content}</Tooltip>;
}
