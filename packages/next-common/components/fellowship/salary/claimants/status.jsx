import { has } from "lodash-es";

export default function FellowshipSalaryMemberStatus({ status }) {
  let content = <span className="text-textTertiary">-</span>;

  if (has(status, "attempted")) {
    content = <span className="text-blue500">Attempted</span>;
  } else if (has(status, "registered")) {
    content = <span className="text-green500">Registered</span>;
  } else if (has(status, "nothing")) {
    content = <span className="text-textTertiary">Nothing</span>;
  }

  return <div className="inline-block">{content}</div>;
}
