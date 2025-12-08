import Link from "next-common/components/link";

export function useProfileFellowshipSalaryPaymentCycleColumn(props = {}) {
  return {
    name: "Cycle",
    width: 80,
    cellRender(data, idx) {
      return (
        <Link
          key={idx}
          href={`/fellowship/salary/cycles/${data.index}`}
          className="text14Medium text-theme500"
        >
          #{data.index}
        </Link>
      );
    },
    ...props,
  };
}
