import FieldLoading from "next-common/components/icons/fieldLoading";
import { isEmpty } from "lodash-es";

export default function SpendPeriod({ summary }) {
  if (isEmpty(summary)) {
    return <FieldLoading />;
  }

  return (
    <>
      {(summary?.spendPeriod || []).map((item, index) => (
        <span className={index % 2 === 1 ? "unit" : ""} key={index}>
          {item}
        </span>
      ))}

      <div className="!ml-0 text12Medium text-textPrimary space-x-1">
        {(summary?.totalPeriod || []).map((item, index) => (
          <span
            className={index % 2 === 1 ? "unit total" : "total"}
            key={index}
          >
            {item}
          </span>
        ))}
      </div>
    </>
  );
}
