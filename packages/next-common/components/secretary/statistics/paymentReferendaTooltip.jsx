import Tooltip from "next-common/components/tooltip";
import Link from "next-common/components/link";
import { toPrecision } from "next-common/utils";

export default function PaymentReferendaTooltip({
  paymentReferenda = [],
  children,
}) {
  if (!paymentReferenda || paymentReferenda.length === 0) {
    return children;
  }

  const content = (
    <div className="flex flex-col gap-1.5">
      {paymentReferenda.map((ref) => (
        <div key={ref.referendumIndex} className="whitespace-nowrap">
          <Link
            href={`/fellowship/referenda/${ref.referendumIndex}`}
            className="hover:underline"
          >
            <span className="font-bold">#{ref.referendumIndex}</span>
            {" · "}
            <span className="hover:underline">{ref.title}</span>
          </Link>
          {" · "}
          {toPrecision(ref.value, ref.decimals)} {ref.symbol}
        </div>
      ))}
    </div>
  );

  return <Tooltip content={content}>{children}</Tooltip>;
}
